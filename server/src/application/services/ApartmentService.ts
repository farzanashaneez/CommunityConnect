import { MongoApartmentRepository } from "../../infrastructure/database/MongoApartmentRepository";

export default class ApartmentService{
    private apartmentrepo = new MongoApartmentRepository();
    async markFilled(id:string,doFill:boolean){
return this.apartmentrepo.markFilled(id,doFill)
    }
}