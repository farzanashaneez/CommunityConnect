import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialogue';

interface UserRowProps {
  imageUrl: string;
  name: string;
  apartmentNumber: string;
  onRemove: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ imageUrl, name, apartmentNumber, onRemove }) => {
  const [open,setOpen]=useState(false)
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
  onClick={()=>{setOpen(true)}}
  className="text-red-500 hover:underline transition-colors text-xs"
>
  Remove
</button>
<ConfirmationDialog
open={open}
onClose={()=>{setOpen(false)}}
onConfirm={()=>{onRemove()}}
title='Delete'
message='Are you sure to delete the user'
/>
    </div>
  );
};

export default UserRow;