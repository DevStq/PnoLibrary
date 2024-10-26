export interface Book {
    id: string;
  title: string;
  author: string;
  description?: string; // Now optional
  imageUrl?: string;    // Now optional
  status: string; 
}
