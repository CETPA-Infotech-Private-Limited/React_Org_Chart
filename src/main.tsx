import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
export { default as Tree } from './components/OrgChart/tree.tsx';
export { default as TreeNode } from './components/OrgChart/treeNode.tsx';
export type { TreeProps } from './components/OrgChart/tree.tsx';
export type { TreeNodeProps } from './components/OrgChart/treeNode.tsx';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
