import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
interface ErrorResponse {
    message: string;
  }
const useFetchData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;


// import React from 'react';
// import useFetchData from './hooks/useFetchData';

// const UserList: React.FC = () => {
//   const { data, loading, error } = useFetchData<User[]>('/api/users');

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <ul>
//       {data?.map(user => (
//         <li key={user.id}>{user.firstName} {user.lastName}</li>
//       ))}
//     </ul>
//   );
// };

// export default UserList;