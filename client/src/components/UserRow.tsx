import React from 'react';

interface UserRowProps {
  imageUrl: string;
  name: string;
  apartmentNumber: string;
  onRemove: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ imageUrl, name, apartmentNumber, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600">Apartment: {apartmentNumber}</p>
        </div>
      </div>
      <button 
  onClick={onRemove}
  className="text-red-500 hover:underline transition-colors"
>
  Remove
</button>

    </div>
  );
};

export default UserRow;