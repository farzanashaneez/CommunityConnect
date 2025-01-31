export interface Apartment {
  id?: string;
  _id?: string;
  type: '1BHK' | '2BHK' | '3BHK'; 
  buildingSection: 'A' | 'B' | 'C' | 'D' | 'E'; 
  apartmentNumber: number; 
  isfilled: boolean; 
}