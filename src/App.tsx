import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from './main'; 
const App = () => {
  const [data, setData] = useState<any>(null);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetch('/data/employee.json')
      .then(res => res.json())
      .then(json => setData(json.data))
      .catch(err => console.error('Failed to load data', err));
  }, []);

  const handleemployeelist = (mappedUser: any[]) => {
    if (mappedUser.length > 0) {
      const employeeList = mappedUser.map(user => user.userDetail).join('\n');
      alert(`Employees:\n${employeeList}`);
    }
  };

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const renderNodeLabel = (node: any) => {
    const isExpanded = expandedNodes[node.id] ?? true;

    return (
      <div className="p-2 w-40 bg-blue-200 rounded-xl inline-block">
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-bold text-gray-700">{node.description}</div>
            </div>
            <div>
              {node.mappedUser && node.mappedUser.length > 0 && (
                <div
                  onClick={() => handleemployeelist(node.mappedUser)}
                  className="px-2 bg-white rounded-full inline-block border-2 border-black hover:bg-blue-400 cursor-pointer"
                >
                  i
                </div>
              )}
            </div>
          </div>

          {node.childGroups && node.childGroups.length > 0 && (
            <div
              onClick={() => toggleExpand(node.id)}
              className="mt-4 text-center cursor-pointer text-sm"
            >
              {isExpanded ? '⇩' : '⇧'}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTree = (node: any) => {
    if (!node) return null;
    const isExpanded = expandedNodes[node.id] ?? true;

    return (
      <TreeNode key={node.id} label={renderNodeLabel(node)}>
        {isExpanded &&
          node.childGroups &&
          node.childGroups
            .filter((child: any) => Object.keys(child).length > 0)
            .map((child: any) => renderTree(child))}
      </TreeNode>
    );
  };

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="py-5 px-2 bg-gray-100 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-4">Org Chart</h1>

    
      <div className="">
        <div className="justify-center">
          <Tree
            lineWidth="2px"
            lineColor="#2196f3"
            lineBorderRadius="10px"
            label={renderNodeLabel(data)}
          >
            {data.childGroups &&
              data.childGroups
                .filter((child: any) => Object.keys(child).length > 0)
                .map((child: any) => renderTree(child))}
          </Tree>
        </div>
      </div>
    </div>
  );
};

export default App;
