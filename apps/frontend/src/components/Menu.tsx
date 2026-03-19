import React from 'react';
import { Link } from 'react-router-dom';

interface MenuProps {
  linkname: string;
  url: string;
}

const Menu: React.FC<MenuProps> = ({ linkname, url }) => {
  return (
    <Link
      to={url}
      className="hover:bg-yellow-300 p-1 rounded font-bold font-sans"
    >
      {linkname}
    </Link>
  );
};

export default Menu;