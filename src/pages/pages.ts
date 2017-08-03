import { PostsPage } from './posts/posts';
import { AccountPage } from './account/account';
import { TabsPage } from './tabs/tabs';
import { TutorialPage } from './tutorial/tutorial';
import { ChatPage} from './chat/chat';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = TutorialPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = PostsPage;
export const Tab2Root = ChatPage;
export const Tab3Root = AccountPage;
