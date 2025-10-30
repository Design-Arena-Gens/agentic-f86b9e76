import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Golden Stories Video Maker',
  description:
    'Generate faceless Facebook videos tailored for older adults with heartwarming stories and gentle pacing.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <h1>Golden Stories Video Automation</h1>
            <p className="tagline">
              Create soothing, story-driven faceless videos that resonate with experienced audiences.
            </p>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            <p>Crafted with care for the stories worth revisiting.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
