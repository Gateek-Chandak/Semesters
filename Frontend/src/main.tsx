import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SideBar from './components/Sidebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidebarProvider>
        <SideBar />
        <main className='w-full'>
          <SidebarTrigger />
          <App />
        </main>
    </SidebarProvider>
  </StrictMode>,
)
