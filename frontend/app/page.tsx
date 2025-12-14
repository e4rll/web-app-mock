import { MainLayout } from './components/layout/MainLayout';
import { ChatContainer } from './components/chat/ChatContainer';

export default function HomePage() {
  return (
    <MainLayout>
      <ChatContainer conversation={null} key="new" />
    </MainLayout>
  );
}
