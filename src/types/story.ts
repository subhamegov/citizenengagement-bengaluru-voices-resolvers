// DIGIT PGR-ready data structures for Citizen Engagement

export type IssueCategory = 'roads' | 'water' | 'waste' | 'streetlights' | 'encroachment' | 'traffic' | 'construction' | 'safety' | 'other';
export type StoryCategory = 'complaint' | 'idea' | 'appreciation';
export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'escalated';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type WorkflowAction = 'CREATE' | 'ASSIGN' | 'IN_PROGRESS' | 'REQUEST_INFO' | 'RESOLVE' | 'ESCALATE' | 'CLOSE' | 'REOPEN';

export interface WorkflowHistoryItem {
  id: string;
  performedBy: string;
  performedByRole: 'citizen' | 'officer' | 'system';
  action: WorkflowAction;
  note?: string;
  timestamp: string;
}

export interface TicketRemark {
  id: string;
  by: string;
  byRole: 'citizen' | 'officer';
  text: string;
  timestamp: string;
  attachments?: { fileStoreId: string; fileName: string }[];
}

export interface CitizenInfo {
  name: string;
  mobileNumber?: string;
  email?: string;
}

export interface SLAInfo {
  dueInHours: number;
  remaining: number; // can be negative if overdue
  deadline: string;
}

export interface Story {
  id: string;
  ticketId: string; // Reference number for citizens
  tenantId: string;
  category: StoryCategory;
  issueCategory?: IssueCategory;
  serviceCode?: string; // DIGIT PGR service code
  title: string;
  description: string;
  audioUrl?: string;
  audioBlob?: Blob;
  audioDuration?: number;
  photos?: string[]; // URLs to uploaded photos
  attachments?: { fileStoreId: string; fileName: string }[];
  lat: number;
  lng: number;
  locationDescription?: string;
  wardCode?: string;
  wardName?: string;
  createdAt: string;
  updatedAt?: string;
  source: 'CITIZEN_ENGAGEMENT';
  
  // Contact info
  reporterName?: string;
  reporterPhone?: string;
  citizen?: CitizenInfo;
  
  // Rating (1-5 stars)
  serviceRating?: number;
  
  // Status tracking
  status: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  assignedDepartment?: string;
  departmentCode?: string;
  
  // SLA tracking
  slaDeadline?: string;
  sla?: SLAInfo;
  isOverdue?: boolean;
  
  // Updates and comments (legacy)
  updates?: TicketUpdate[];
  satisfactionRating?: number; // Post-resolution rating
  
  // Workflow history (DIGIT-compatible)
  history?: WorkflowHistoryItem[];
  remarks?: TicketRemark[];
  
  // DIGIT PGR mapping
  serviceRequestId?: string;
}

export interface TicketUpdate {
  id: string;
  message: string;
  author: string;
  authorType: 'citizen' | 'staff';
  createdAt: string;
}

export type DepartmentSelectionSource = 'AUTO' | 'USER_OVERRIDE';

export type Department = 
  | 'Environment'
  | 'Water and Sewerage'
  | 'Works'
  | 'Public Health'
  | 'Mobility and ICT Infrastructure'
  | 'To be assigned';

export const DEPARTMENTS: Department[] = [
  'Environment',
  'Water and Sewerage',
  'Works',
  'Public Health',
  'Mobility and ICT Infrastructure',
];

export const CATEGORY_TO_DEPARTMENT: Record<IssueCategory, Department> = {
  roads: 'Works',
  water: 'Water and Sewerage',
  waste: 'Environment',
  streetlights: 'Mobility and ICT Infrastructure',
  encroachment: 'Works',
  traffic: 'Mobility and ICT Infrastructure',
  construction: 'Works',
  safety: 'Public Health',
  other: 'To be assigned',
};

export interface BeneficiaryInfo {
  isOnBehalf: boolean;
  name?: string;
  phone?: string;
  relationship?: string;
  receiveUpdates: boolean;
}

export interface StorySubmission {
  category: StoryCategory;
  issueCategory?: IssueCategory;
  title: string;
  description?: string;
  audioBlob?: Blob;
  audioDuration?: number;
  photos?: File[];
  lat?: number;
  lng?: number;
  locationDescription?: string;
  wardCode?: string;
  reporterName?: string;
  reporterPhone?: string;
  shareContactWithDepartment?: boolean;
  serviceRating?: number;
  responsibleDepartment?: Department;
  departmentSelectionSource?: DepartmentSelectionSource;
  beneficiary?: BeneficiaryInfo;
}

export interface Ward {
  code: string;
  name: string;
  subcounty: string;
  center: { lat: number; lng: number };
}

// City wards (sample data — replace with real MDMS ward data)
export const WARDS: Ward[] = [
  // South Zone
  { code: 'JAYANAGAR', name: 'Jayanagar', subcounty: 'South Zone', center: { lat: 12.9250, lng: 77.5938 } },
  { code: 'BTM_LAYOUT', name: 'BTM Layout', subcounty: 'South Zone', center: { lat: 12.9166, lng: 77.6101 } },
  { code: 'BASAVANAGUDI', name: 'Basavanagudi', subcounty: 'South Zone', center: { lat: 12.9432, lng: 77.5730 } },
  { code: 'BANASHANKARI', name: 'Banashankari', subcounty: 'South Zone', center: { lat: 12.9255, lng: 77.5468 } },
  { code: 'JP_NAGAR', name: 'JP Nagar', subcounty: 'South Zone', center: { lat: 12.9063, lng: 77.5857 } },
  { code: 'KUMARASWAMY_LAYOUT', name: 'Kumaraswamy Layout', subcounty: 'South Zone', center: { lat: 12.9050, lng: 77.5600 } },
  // Bommanahalli Zone
  { code: 'KORAMANGALA', name: 'Koramangala', subcounty: 'Bommanahalli Zone', center: { lat: 12.9352, lng: 77.6245 } },
  { code: 'HSR_LAYOUT', name: 'HSR Layout', subcounty: 'Bommanahalli Zone', center: { lat: 12.9116, lng: 77.6389 } },
  { code: 'BOMMANAHALLI', name: 'Bommanahalli', subcounty: 'Bommanahalli Zone', center: { lat: 12.9000, lng: 77.6200 } },
  { code: 'BELLANDUR', name: 'Bellandur', subcounty: 'Bommanahalli Zone', center: { lat: 12.9260, lng: 77.6762 } },
  { code: 'ELECTRONIC_CITY', name: 'Electronic City', subcounty: 'Bommanahalli Zone', center: { lat: 12.8456, lng: 77.6603 } },
  // East Zone
  { code: 'INDIRANAGAR', name: 'Indiranagar', subcounty: 'East Zone', center: { lat: 12.9784, lng: 77.6408 } },
  { code: 'SHIVAJINAGAR', name: 'Shivajinagar', subcounty: 'East Zone', center: { lat: 12.9850, lng: 77.6050 } },
  { code: 'CV_RAMAN_NAGAR', name: 'CV Raman Nagar', subcounty: 'East Zone', center: { lat: 12.9860, lng: 77.6650 } },
  { code: 'ULSOOR', name: 'Ulsoor', subcounty: 'East Zone', center: { lat: 12.9815, lng: 77.6200 } },
  { code: 'FRAZER_TOWN', name: 'Frazer Town', subcounty: 'East Zone', center: { lat: 12.9960, lng: 77.6130 } },
  // North Zone
  { code: 'MALLESHWARAM', name: 'Malleshwaram', subcounty: 'North Zone', center: { lat: 13.0035, lng: 77.5700 } },
  { code: 'HEBBAL', name: 'Hebbal', subcounty: 'North Zone', center: { lat: 13.0358, lng: 77.5970 } },
  { code: 'SADASHIVANAGAR', name: 'Sadashivanagar', subcounty: 'North Zone', center: { lat: 13.0100, lng: 77.5800 } },
  { code: 'RT_NAGAR', name: 'RT Nagar', subcounty: 'North Zone', center: { lat: 13.0200, lng: 77.5950 } },
  { code: 'SANJAYNAGAR', name: 'Sanjaynagar', subcounty: 'North Zone', center: { lat: 13.0280, lng: 77.5730 } },
  // West Zone
  { code: 'RAJAJINAGAR', name: 'Rajajinagar', subcounty: 'West Zone', center: { lat: 12.9900, lng: 77.5550 } },
  { code: 'VIJAYANAGAR', name: 'Vijayanagar', subcounty: 'West Zone', center: { lat: 12.9700, lng: 77.5350 } },
  { code: 'NAGARBHAVI', name: 'Nagarbhavi', subcounty: 'West Zone', center: { lat: 12.9600, lng: 77.5100 } },
  { code: 'KENGERI', name: 'Kengeri', subcounty: 'West Zone', center: { lat: 12.9100, lng: 77.4850 } },
  // Mahadevapura Zone
  { code: 'WHITEFIELD', name: 'Whitefield', subcounty: 'Mahadevapura Zone', center: { lat: 12.9698, lng: 77.7500 } },
  { code: 'MARATHAHALLI', name: 'Marathahalli', subcounty: 'Mahadevapura Zone', center: { lat: 12.9591, lng: 77.7009 } },
  { code: 'KR_PURAM', name: 'KR Puram', subcounty: 'Mahadevapura Zone', center: { lat: 12.9980, lng: 77.7060 } },
  { code: 'VARTHUR', name: 'Varthur', subcounty: 'Mahadevapura Zone', center: { lat: 12.9400, lng: 77.7400 } },
  { code: 'HOODI', name: 'Hoodi', subcounty: 'Mahadevapura Zone', center: { lat: 12.9900, lng: 77.7200 } },
  // Yelahanka Zone
  { code: 'YELAHANKA', name: 'Yelahanka', subcounty: 'Yelahanka Zone', center: { lat: 13.1007, lng: 77.5963 } },
  { code: 'THANISANDRA', name: 'Thanisandra', subcounty: 'Yelahanka Zone', center: { lat: 13.0600, lng: 77.6300 } },
  { code: 'JAKKUR', name: 'Jakkur', subcounty: 'Yelahanka Zone', center: { lat: 13.0700, lng: 77.6000 } },
  { code: 'SAHAKARNAGAR', name: 'Sahakarnagar', subcounty: 'Yelahanka Zone', center: { lat: 13.0550, lng: 77.5800 } },
  // Dasarahalli Zone
  { code: 'DASARAHALLI', name: 'Dasarahalli', subcounty: 'Dasarahalli Zone', center: { lat: 13.0450, lng: 77.5200 } },
  { code: 'PEENYA', name: 'Peenya', subcounty: 'Dasarahalli Zone', center: { lat: 13.0300, lng: 77.5150 } },
  { code: 'VIDYARANYAPURA', name: 'Vidyaranyapura', subcounty: 'Dasarahalli Zone', center: { lat: 13.0780, lng: 77.5550 } },
  // RR Nagar Zone
  { code: 'RR_NAGAR', name: 'Rajarajeshwari Nagar', subcounty: 'RR Nagar Zone', center: { lat: 12.9200, lng: 77.5100 } },
  { code: 'UTTARAHALLI', name: 'Uttarahalli', subcounty: 'RR Nagar Zone', center: { lat: 12.8900, lng: 77.5400 } },
];

export const ISSUE_CATEGORIES: { code: IssueCategory; label: string; description: string; serviceCode: string }[] = [
  { code: 'roads', label: 'Potholes / Road Damage', description: 'Potholes, road damage, footpath issues', serviceCode: 'ROAD_MAINTENANCE' },
  { code: 'waste', label: 'Garbage / Solid Waste', description: 'Garbage not collected, illegal dumping', serviceCode: 'WASTE_MANAGEMENT' },
  { code: 'streetlights', label: 'Streetlights', description: 'Broken, flickering, or missing lights', serviceCode: 'STREET_LIGHTING' },
  { code: 'water', label: 'Water / Sewerage / Drainage', description: 'Leaks, blockages, Cauvery supply', serviceCode: 'WATER_SUPPLY' },
  { code: 'encroachment', label: 'Encroachment', description: 'Footpath or public land encroachment', serviceCode: 'ENCROACHMENT' },
  { code: 'traffic', label: 'Traffic Signal / Signage', description: 'Faulty signals, missing signs', serviceCode: 'TRAFFIC' },
  { code: 'construction', label: 'Construction Nuisance', description: 'Debris, dust, illegal construction', serviceCode: 'CONSTRUCTION' },
  { code: 'safety', label: 'Public Safety', description: 'CCTV, dark spots, unsafe areas', serviceCode: 'SAFETY' },
  { code: 'other', label: 'Other Issues', description: 'Other service requests', serviceCode: 'GENERAL' },
];

export const CATEGORY_LABELS: Record<StoryCategory, string> = {
  complaint: 'Report a Problem',
  idea: 'Share an Idea',
  appreciation: 'Give Thanks',
};

export const CATEGORY_DESCRIPTIONS: Record<StoryCategory, string> = {
  complaint: 'Something that needs fixing or attention',
  idea: 'A suggestion to improve our city',
  appreciation: 'Something good that happened',
};

export const STATUS_LABELS: Record<TicketStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: 'New', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  assigned: { label: 'Assigned', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  in_progress: { label: 'In Progress', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  resolved: { label: 'Resolved', color: 'text-green-700', bgColor: 'bg-green-100' },
  escalated: { label: 'Escalated', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export const PRIORITY_LABELS: Record<TicketPriority, { label: string; color: string }> = {
  LOW: { label: 'Low', color: 'text-slate-600' },
  MEDIUM: { label: 'Medium', color: 'text-blue-600' },
  HIGH: { label: 'High', color: 'text-orange-600' },
  URGENT: { label: 'Urgent', color: 'text-red-600' },
};

export const WORKFLOW_ACTION_LABELS: Record<WorkflowAction, { label: string }> = {
  CREATE: { label: 'Created' },
  ASSIGN: { label: 'Assigned' },
  IN_PROGRESS: { label: 'In Progress' },
  REQUEST_INFO: { label: 'Info Requested' },
  RESOLVE: { label: 'Resolved' },
  ESCALATE: { label: 'Escalated' },
  CLOSE: { label: 'Closed' },
  REOPEN: { label: 'Reopened' },
};