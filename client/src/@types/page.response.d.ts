import z from "zod";

export const PageRes = <T>(object: z.ZodType<T>) =>
  z.object({
    totalCount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    data: z.array(object).nullable(),
    message: z.string().optional(),  
  });


export default interface PageResponse<T> {
  totalCount: number;      
  totalPages: number;      
  currentPage: number;     
  pageSize: number;        
  data: T[];               
  message?: string;       
}
