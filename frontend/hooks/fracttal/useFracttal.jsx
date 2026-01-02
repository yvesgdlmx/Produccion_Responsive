import { useContext } from 'react';
import FracttalContext from '../../context/fracttal/FracttalProvider';

const useFracttal = () => {
  return useContext(FracttalContext);
};

export default useFracttal;