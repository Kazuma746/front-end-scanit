import { Application, ApplicationStats, CreateApplicationData, UpdateApplicationData } from '@/types/application';

const API_BASE_URL = (process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL || '').replace(/\/$/, '');

class ApplicationService {
  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getUserApplications(token: string): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/applications/user`, {
      headers: this.getAuthHeaders(token)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des candidatures');
    }

    return response.json();
  }

  async getApplicationStats(token: string): Promise<ApplicationStats> {
    const response = await fetch(`${API_BASE_URL}/applications/stats`, {
      headers: this.getAuthHeaders(token)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }

    return response.json();
  }

  async createApplication(token: string, data: CreateApplicationData): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de la candidature');
    }

    return response.json();
  }

  async updateApplication(token: string, id: string, data: UpdateApplicationData): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/update/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de la candidature');
    }

    return response.json();
  }

  async deleteApplication(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la suppression de la candidature');
    }
  }

  async getApplicationById(token: string, id: string): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      headers: this.getAuthHeaders(token)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la candidature');
    }

    return response.json();
  }
}

export const applicationService = new ApplicationService(); 