import React from 'react';

const CardForMatch = ({ image, name, age, description }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full h-64 object-cover" src={image} alt={`${name}'s profile`} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}, {age}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
          Nope
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
          Like
        </button>
      </div>
    </div>
  );
};

export default CardForMatch;
