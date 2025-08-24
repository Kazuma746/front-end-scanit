'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFileText, FiClock, FiTrendingUp, FiCheck, FiLoader, FiAlertCircle, FiTrash2, FiEye, FiPlus, FiEdit, FiBriefcase } from 'react-icons/fi';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplicationForm from '@/components/ApplicationForm';
import { Application, ApplicationStats, CreateApplicationData, UpdateApplicationData } from '@/types/application';
import { applicationService } from '@/services/applicationService';

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
  
  // États pour les candidatures
  const [activeTab, setActiveTab] = useState<'cv' | 'applications'>('cv');
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    totalApplications: 0,
    recentApplications: 0,
    statusCounts: { pending: 0, interview: 0, rejected: 0, accepted: 0 }
  });
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [applicationLoading, setApplicationLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/cv/stats`, {
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
      console.log('Scores des analyses:', data.recentAnalysesList.map((analysis: any) => analysis.score));
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/cv/${cvId}`, {
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

  // Fonctions pour les candidatures
  const fetchApplications = async () => {
    if (!token) return;
    try {
      const [applicationsData, statsData] = await Promise.all([
        applicationService.getUserApplications(token),
        applicationService.getApplicationStats(token)
      ]);
      setApplications(applicationsData);
      setApplicationStats(statsData);
    } catch (err) {
      setError('Erreur lors du chargement des candidatures');
      console.error('Erreur:', err);
    }
  };

  const handleCreateApplication = async (data: CreateApplicationData) => {
    if (!token) return;
    setApplicationLoading(true);
    try {
      await applicationService.createApplication(token, data);
      await fetchApplications();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la candidature');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleUpdateApplication = async (data: UpdateApplicationData) => {
    if (!token || !editingApplication) return;
    setApplicationLoading(true);
    try {
      await applicationService.updateApplication(token, editingApplication._id, data);
      await fetchApplications();
      setEditingApplication(null);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de la candidature');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!token) return;
    try {
      await applicationService.deleteApplication(token, id);
      await fetchApplications();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la candidature');
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && token) {
      fetchStats();
      fetchApplications();
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      interview: { label: 'Entretien', color: 'bg-blue-100 text-blue-800' },
      rejected: { label: 'Refusé', color: 'bg-red-100 text-red-800' },
      accepted: { label: 'Accepté', color: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatApplicationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
            Bienvenue {user?.firstName}, gérez vos CV et vos candidatures
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        {/* Onglets */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('cv')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cv'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiFileText className="w-5 h-5" />
                <span>Analyses CV</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiBriefcase className="w-5 h-5" />
                <span>Candidatures</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Contenu conditionnel basé sur l'onglet actif */}
        {activeTab === 'cv' && (
          <>
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
          </>
        )}

        {activeTab === 'applications' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total candidatures"
                value={applicationStats.totalApplications}
                icon={FiBriefcase}
                description="Nombre total de candidatures"
              />
              <StatCard
                title="En attente"
                value={applicationStats.statusCounts.pending}
                icon={FiClock}
                description="Candidatures en attente"
              />
              <StatCard
                title="Entretiens"
                value={applicationStats.statusCounts.interview}
                icon={FiCheck}
                description="Entretiens programmés"
              />
              <StatCard
                title="Acceptées"
                value={applicationStats.statusCounts.accepted}
                icon={FiTrendingUp}
                description="Candidatures acceptées"
              />
            </div>
          </>
        )}

        {/* Section des tableaux */}
        {activeTab === 'cv' && (
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
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary">
                Suivi des candidatures
              </h2>
              <button
                onClick={() => setIsApplicationFormOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <FiPlus size={16} />
                <span>Nouvelle candidature</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Entreprise</th>
                    <th className="text-left py-3 px-4">Poste</th>
                    <th className="text-left py-3 px-4">CV lié</th>
                    <th className="text-center py-3 px-4">Statut</th>
                    <th className="text-left py-3 px-4">Commentaires</th>
                    <th className="text-right py-3 px-4">Date</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{application.companyName}</td>
                      <td className="py-3 px-4">{application.jobTitle || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{application.cvId.name}</span>
                          <span className={`text-xs ${getScoreColor(application.cvId.score.overall)}`}>
                            ({application.cvId.score.overall}%)
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {application.comments || '-'}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-sm text-gray-600">
                        {formatApplicationDate(application.applicationDate)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingApplication(application);
                              setIsApplicationFormOpen(true);
                            }}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
                                handleDeleteApplication(application._id);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        Aucune candidature enregistrée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formulaire de candidature */}
        <ApplicationForm
          isOpen={isApplicationFormOpen}
          onClose={() => {
            setIsApplicationFormOpen(false);
            setEditingApplication(null);
          }}
          onSubmit={(data) => (
            editingApplication
              ? handleUpdateApplication(data as UpdateApplicationData)
              : handleCreateApplication(data as CreateApplicationData)
          )}
          application={editingApplication}
          cvOptions={stats.recentAnalysesList.map(cv => ({ _id: cv._id, name: cv.name }))}
          isLoading={applicationLoading}
        />
      </main>
      <Footer />
    </>
  );
} 