'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFileText, FiClock, FiTrendingUp, FiCheck, FiLoader, FiAlertCircle, FiTrash2, FiEye } from 'react-icons/fi';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AnalysisStats {
  totalAnalyses: number;
  recentAnalyses: number;
  averageScore: number;
  recentAnalysesList: Array<{
    _id: string;
    name: string;
    score: {
      overall: number;
      ats: number;
      readability: number;
    };
    status: 'pending' | 'analyzing' | 'completed' | 'error';
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<AnalysisStats>({
    totalAnalyses: 0,
    recentAnalyses: 0,
    averageScore: 0,
    recentAnalysesList: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/cv/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      console.log('=== Stats du Dashboard ===');
      console.log('Données reçues:', data);
      console.log('Liste des analyses:', data.recentAnalysesList);
      console.log('Scores des analyses:', data.recentAnalysesList.map(analysis => analysis.score));
      setStats(data);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des statistiques');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cvId: string) => {
    try {
      const response = await fetch(`http://localhost:7000/api/cv/${cvId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du CV');
      }

      // Rafraîchir les statistiques après la suppression
      fetchStats();
    } catch (err) {
      setError('Une erreur est survenue lors de la suppression du CV');
      console.error('Erreur:', err);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && token) {
      fetchStats();
    }
  }, [user, token, authLoading, router]);

  const StatCard = ({ title, value, icon: Icon, description }: { 
    title: string;
    value: number;
    icon: any;
    description: string;
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <Icon className="text-primary" size={24} />
      </div>
      <p className="text-3xl font-bold text-secondary mb-2">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return <FiCheck className="text-green-500" />;
      case 'analyzing':
        return <FiLoader className="text-blue-500 animate-spin" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.firstName}, voici vos statistiques d'analyse de CV
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total des analyses"
            value={stats.totalAnalyses}
            icon={FiFileText}
            description="Nombre total de CV analysés"
          />
          <StatCard
            title="Analyses récentes"
            value={stats.recentAnalyses}
            icon={FiClock}
            description="CV analysés ces 30 derniers jours"
          />
          <StatCard
            title="Score moyen"
            value={Math.round(stats.averageScore)}
            icon={FiTrendingUp}
            description="Score moyen de vos CV"
          />
        </div>

        {/* Section des dernières analyses */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-secondary mb-6">
            Dernières analyses
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nom du fichier</th>
                  <th className="text-center py-3 px-4">Score global</th>
                  <th className="text-center py-3 px-4">Score ATS</th>
                  <th className="text-center py-3 px-4">Lisibilité</th>
                  <th className="text-center py-3 px-4">Statut</th>
                  <th className="text-right py-3 px-4">Date</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAnalysesList.map((analysis) => (
                  <tr key={analysis._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{analysis.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-medium ${getScoreColor(analysis.score.overall)}`}>
                        {analysis.score.overall}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-medium ${getScoreColor(analysis.score.ats)}`}>
                        {analysis.score.ats}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-medium ${getScoreColor(analysis.score.readability)}`}>
                        {analysis.score.readability}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <StatusIcon status={analysis.status} />
                        <span className="ml-2 text-sm">
                          {analysis.status === 'completed' ? 'Terminé' :
                           analysis.status === 'analyzing' ? 'En cours' :
                           analysis.status === 'error' ? 'Erreur' :
                           'En attente'}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-600">
                      {formatDate(analysis.createdAt)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
                              handleDelete(analysis._id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Supprimer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {stats.recentAnalysesList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Aucune analyse récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 