export interface RefundFormData {
  fullName: string;
  email: string;
  bookingRef: string;
  bookingDate: string;
  refundReason: string;
  additionalDetails?: string;
}

export interface UploadedFile {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

export interface RefundSubmissionResponse {
  success: boolean;
  submissionId?: string;
  refId?: string;
  fileUrls?: UploadedFile[];
  error?: string;
}
