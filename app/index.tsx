import HomeScreen from '../src/screens/HomeScreen';
import SetupScreen from '../src/screens/SetupScreen';
import { useStore } from '../src/store/useStore';

export default function Route() {
  const loaded = useStore((s) => s.loaded);
  const onboarded = useStore((s) => s.profile.onboarded);

  // If store is still loading from local storage, wait
  if (!loaded) return null;

  // First page: Parents fill in child detail. Once filled, they come to Home.
  if (!onboarded) {
    return <SetupScreen />;
  }

  return <HomeScreen />;
}
