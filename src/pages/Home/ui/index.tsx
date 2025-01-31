import { Div } from "@components";
import { Header } from "./layouts/Header";
import { DailyInsights, MoodPicker } from "./components";

const Home: React.FC = () => {
  return (
    <Div container>
      <Header />
      <DailyInsights />
      <MoodPicker />
    </Div>
  );
};

export default Home;
