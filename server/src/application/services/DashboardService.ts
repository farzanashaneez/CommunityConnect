
import { MongoApartmentRepository } from '../../infrastructure/database/MongoApartmentRepository';
import { MongoUserRepository } from '../../infrastructure/database/MongoUserRepository';
import { MongoServiceRepository } from '../../infrastructure/database/MongoServiceRepository';
import { MongoEventRepository } from '../../infrastructure/database/MongoEventRepository';
import { MongoPostRepository } from '../../infrastructure/database/MongoPostRepository';

 class DashboardService {
  
    private apartmentRepository=new MongoApartmentRepository();
    private userRepository=new MongoUserRepository();
    private serviceRepository=new MongoServiceRepository();
    private eventRepository=new MongoEventRepository();
    private postRepository=new MongoPostRepository();
  

  async getDashboardData() {
    const [
        totalApartments,
        apartments,
        userCount,
      recentUsers,
      recentServices,
      recentEvents,
      recentPosts,
      recentServiceRequests
    ] = await Promise.all([
      this.apartmentRepository.getapartmentCount(),
      this.apartmentRepository.findAll(),
      this.userRepository.getUserCount(),
      this.userRepository.findRecent(10),
      this.serviceRepository.findRecent(10),
      this.eventRepository.findRecent(10),
      this.postRepository.findRecent(10),
      this.serviceRepository.findRecentRequestedServices(10)
    ]);

    const totalResidents = userCount;
    const occupiedApartments = apartments.filter(apt => apt.isfilled).length;

    return {
      totalApartments,
      totalResidents,
      occupiedApartments,
      recentUsers,
      recentServices,
      recentEvents,
      recentPosts,
      recentServiceRequests
    };
  }
}
export default new DashboardService()