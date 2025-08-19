export interface Application {
  _id: string;
  userId: string;
  cvId: {
    _id: string;
    name: string;
    score: {
      overall: number;
      ats: number;
      readability: number;
    };
    createdAt: string;
  };
  companyName: string;
  jobTitle?: string;
  status: 'pending' | 'interview' | 'rejected' | 'accepted';
  comments?: string;
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStats {
  totalApplications: number;
  recentApplications: number;
  statusCounts: {
    pending: number;
    interview: number;
    rejected: number;
    accepted: number;
  };
}

export interface CreateApplicationData {
  cvId: string;
  companyName: string;
  jobTitle?: string;
  status?: 'pending' | 'interview' | 'rejected' | 'accepted';
  comments?: string;
  applicationDate?: string;
}

export interface UpdateApplicationData {
  companyName?: string;
  jobTitle?: string;
  status?: 'pending' | 'interview' | 'rejected' | 'accepted';
  comments?: string;
  applicationDate?: string;
} 