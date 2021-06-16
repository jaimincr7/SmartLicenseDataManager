import { IHomeProps } from './home.model';
import './home.style.scss';

const Home: React.FC<IHomeProps> = () => {
  return (
    <div className="homePage">
      <h1>Welcome to home page</h1>
    </div>
  );
};

export default Home;
