import type {LocalDateTime} from "@/api/dto/LocalDate";

export interface FileDTO {
  id: number;
  uploaderId: number;
  uploaderName: string;
  displayName: string;
  fileName: string;
  isActive: boolean;
  createdAt: LocalDateTime;
  s3URL: string;
}