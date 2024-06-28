

import React from 'react';
import { Handle, Position } from 'reactflow';

const TemplateNode = ({ data, selected, onConnect }) => {
  const handleButtonClick = (buttonNumber) => {
    // Implement logic to handle button click and connect to different nodes
    console.log(`Button ${buttonNumber} clicked.`);
    const sourceHandle = buttonNumber === 1 ? 'a' :
                        buttonNumber === 2 ? 'b' :
                        buttonNumber === 3 ? 'c' : 'd';

    // Simulate removing edges if they exist
    const removedEdges = data.connectedEdges || [];
    removedEdges.forEach(edgeId => onConnect({ remove: edgeId }));

    // Simulate creating new edge
    onConnect({ source: 'node_2', sourceHandle, target: 'node_0' });
  };

  // Array of button labels for demonstration
  const buttons = ['Button 1', 'Button 2', 'Button 3', 'Button 4'];

  return (
    <div className={`w-40 shadow-md rounded-md bg-white ${selected ? "border-solid border-2 border-indigo-500/100" : ""}`}>
      <div className="flex flex-col">
        <div className="max-h-max px-2 py-1 text-left text-black text-xs font-bold rounded-t-md bg-blue-300">
          📋 Action Node
        </div>
        <div className="px-3 py-2">
          <div className="text-xs font-normal text-black">
            {data.paragraph ?? 'This is a paragraph. Click a button below to perform an action.'}
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {/* Render buttons dynamically */}
            {buttons.map((buttonLabel, index) => (
              <button key={index} className="text-xs font-medium text-white bg-blue-500 rounded-md px-2 py-1"
                onClick={() => handleButtonClick(index + 1)}>
                {buttonLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Handles for connections */}
      <Handle type='target' position={Position.Left} className="w-1 rounded-full bg-slate-500" />
      <Handle id="a" type="source" position={Position.Right} className="w-1 rounded-full bg-gray-500" />
      <Handle id='b' type='source' position={Position.Right} style={{top: 70}} className="w-1 rounded-full bg-gray-500" />
      <Handle id='c' type='source' position={Position.Right} style={{top: 130}} className="w-1 rounded-full bg-gray-500"/>
      <Handle id='d' type='source' position={Position.Right} style={{top: 160}} className="w-1 rounded-full bg-gray-500"/>
    </div>
  );
};

export default TemplateNode;
