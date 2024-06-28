import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
  } from "react";
  import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    Panel,
    useReactFlow,
    MiniMap,
    Controls,
    Background,
  } from "reactflow";
  import "reactflow/dist/base.css";
  import SideBar from "./SideBar.jsx";
  import TextNode from "./TextNode.jsx";
  import ImageNode from "./ImageNode.jsx";
  import TemplateNode from "./TemplateNode.jsx"; 
  import AudioNode from "./AudioNode.jsx";
  import VideoNode from "./VideoNode.jsx";
  
  // Key for local storage
  const flowKey = "flow-key";
  
  // Initial nodes setup
  const initialNodes = [
    {
      id: "node_0",
      type: "textnode",
      data: { text: "Text Node" },
      position: { x: 100, y: 5 },
    },
    {
      id: "node_1",
      type: "imagenode",
      data: {
        imageUrl:
          "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      position: { x: 300, y: 5 },
    },
    {
      id: "node_2",
      type: "templatenode",
      data: { paragraph: "This is a template node with buttons." },
      position: { x: 500, y: 5 },
    },
    {
        id: "node_3",
        type: "videonode",
        data: {
          videoUrl:
            "https://www.w3schools.com/html/mov_bbb.mp4",
        },
        position: { x: 700, y: 5 },
      },
      {
        id: "node_4",
        type: "audionode",
        data: {
          audioUrl:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        position: { x: 900, y: 5 },
      },
  ];

  // const initialEdges = [
  //   {id: 'edge-1', source: 'node_2', target: 'node_0', sourceHandle: 'a'},
  //   {id: 'edge-2', source: 'node_2', target: 'node_1', sourceHandle: 'b'},
  //   {id: 'edge-3', source: 'node_2', target: 'node_3', sourceHandle: 'c'},
  //   {id: 'edge-4', source: 'node_2', target: 'node_4', sourceHandle: 'd'},
    
  // ]

  
  
  // Function for generating unique IDs for nodes
  let id = initialNodes.length;
  const getId = () => `node_${id++}`;
  
  const Main = () => {
    // States and hooks setup
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);
    const [nodeText, setNodeText] = useState("");
    const [nodeImg, setNodeImg] = useState("");
    const [nodeTemplate, setNodeTemplate] = useState("");
    const [nodeVideo, setNodeVideo] = useState("");
    const [nodeAudio, setNodeAudio] = useState("");
  
    // Define custom node types
    const nodeTypes = useMemo(
      () => ({
        textnode: TextNode,
        imagenode: ImageNode,
        templatenode: TemplateNode, 
        videonode: VideoNode,
        audionode: AudioNode,
      }),
      []
    );
  
    // Update nodes data when nodeText or selectedElements changes
    useEffect(() => {
      if (selectedElements.length > 0) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === selectedElements[0]?.id) {
              let updatedData = {};
              if (selectedElements[0].type === "textnode") {
                updatedData = {
                  ...node.data,
                  text: nodeText,
                };
              } else if (selectedElements[0].type === "imagenode") {
                updatedData = {
                  ...node.data,
                  imageUrl: nodeImg,
                };
              } else if (selectedElements[0].type === 'templatenode') {
                updatedData = {
                  ...node.data,
                  paragraph: nodeTemplate,
                }
              }
               else if (selectedElements[0].type === "videonode") {
                updatedData = {
                  ...node.data,
                  videoUrl: nodeVideo,
                }; 
              } else if (selectedElements[0].type === "audionode") {
                updatedData = {
                  ...node.data,
                  audioUrl: nodeAudio,
                };
              }
              return {
                ...node,
                data: updatedData,
              };
            }
            return node;
          })
        );
      } else {
        setNodeText(""); // Clear nodeText when no node is selected
        setNodeImg(""); // Clear nodeImg when no node is selected
        setNodeTemplate("");
        setNodeVideo("");
        setNodeAudio("");
      }
    }, [nodeText, nodeImg, nodeTemplate, nodeVideo, nodeAudio, selectedElements, setNodes]);
  
    // Handle node click
    const onNodeClick = useCallback(
      (event, node) => {
        setSelectedElements([node]);
        if (node.type === "textnode") {
          setNodeText(node.data.text);
        } else if (node.type === "imagenode") {
          setNodeImg(node.data.imageUrl);
        } else if (node.type === 'templatenode') {
          setNodeTemplate(node.data.paragraph);
        } else if (node.type === "videonode") {
            setNodeVideo(node.data.videoUrl);
        } else if (node.type === "audionode") {
            setNodeAudio(node.data.audioUrl);
        }
        setNodes((nodes) =>
          nodes.map((n) => ({
            ...n,
            selected: n.id === node.id,
          }))
        );
      },
      [setNodes]
    );
  
    // Setup viewport
    const { setViewport } = useReactFlow();
  
    // Check for empty target handles
    const checkEmptyTargetHandles = () => {
      let emptyTargetHandles = 0;
      edges.forEach((edge) => {
        if (!edge.targetHandle) {
          emptyTargetHandles++;
        }
      });
      return emptyTargetHandles;
    };
  
    // Check if any node is unconnected
    const isNodeUnconnected = useCallback(() => {
      let unconnectedNodes = nodes.filter(
        (node) =>
          !edges.find(
            (edge) => edge.source === node.id || edge.target === node.id
          )
      );
      return unconnectedNodes.length > 0;
    }, [nodes, edges]);
  
    // Save flow to local storage
    const onSave = useCallback(() => {
      if (reactFlowInstance) {
        const emptyTargetHandles = checkEmptyTargetHandles();
        if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
          alert(
            "Error: More than one node has an empty target handle or there are unconnected nodes."
          );
        } else {
          const flow = reactFlowInstance.toObject();
          localStorage.setItem(flowKey, JSON.stringify(flow));
          alert("Save successful!"); // Provide feedback when save is successful
        }
      }
    }, [reactFlowInstance, nodes, isNodeUnconnected]);
  
    // Restore flow from local storage
    const onRestore = useCallback(() => {
      const restoreFlow = async () => {
        const flow = JSON.parse(localStorage.getItem(flowKey));
        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
        }
      };
      restoreFlow();
    }, [setNodes, setViewport, setEdges]);
  
    // Handle edge connection
    const onConnect = useCallback(
      (params) => {
        const { source, sourceHandle } = params;
        // Check if the source handle already has an edge connected
        const isSourceHandleOccupied = edges.some(
          (edge) => edge.source === source && edge.sourceHandle === sourceHandle
        );
        // If the source handle is already occupied, prevent the connection
        if (isSourceHandleOccupied) {
          alert("Source handle already occupied.");
          return;
        }
        console.log("Edge created: ", params);
        setEdges((eds) => addEdge(params, eds));
      },
      [setEdges, edges]
    );
  
    // Enable drop effect on drag over
    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }, []);
  
    // Handle drop event to add a new node
    const onDrop = useCallback(
      (event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData("application/reactflow");
        if (typeof type === "undefined" || !type) {
          return;
        }
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
          id: getId(),
          type,
          position,
          data: {
            label: `${
              type === "textnode"
                ? "Text Node"
                : type === "imagenode"
                ? "Image Node"
                : type === "templatenode"
                ? "Template Node"
                : type === 'videonode'
                ? "Video Node"
                : "Audio Node"
            }`,
            text: type === "textnode" ? "Text Node" : undefined, // Initialize text for text node
            imageUrl:
            type === "imagenode"
                ? "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : undefined,
            paragraph: type === "templatenode" ? "This is a template node with buttons." : undefined, // Initialize text for template node
            videoUrl:
              type === "videonode"
                ? "https://www.w3schools.com/html/mov_bbb.mp4"
                : undefined, // Initialize image URL for image node
            audioUrl:
              type === "audionode"
                ? "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                : undefined,
                
            
          },
        };
        console.log("Node created: ", newNode);
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance, setNodes]
    );
  
    const rfStyle = {
      backgroundColor: "#ffffff",
    };
  
    return (
      <div className="flex flex-row min-h-screen lg:flex-row">
        <div className="flex-grow w-screen h-screen" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={rfStyle}
            onNodeClick={onNodeClick}
            onPaneClick={() => {
              setSelectedElements([]); // Reset selected elements when clicking on pane
              setNodes((nodes) =>
                nodes.map((n) => ({
                  ...n,
                  selected: false, // Reset selected state of nodes when clicking on pane
                }))
              );
            }}
            fitView
          >
            <Background variant="dots" gap={12} size={1} />
            <Controls />
            <MiniMap zoomable pannable />
            <Panel>
              <button
                className=" m-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={onSave}
              >
                save flow
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={onRestore}
              >
                restore flow
              </button>
            </Panel>
          </ReactFlow>
        </div>
  
        <SideBar
          selectedNode={selectedElements[0]}
          setSelectedElements={setSelectedElements}
          nodeText={nodeText}
          setNodeText={setNodeText}
          nodeImg={nodeImg}
          setNodeImg={setNodeImg}
          nodeTemplate={nodeTemplate}
          setNodeTemplate={setNodeTemplate}
          nodeVideo={nodeVideo}
          setNodeVideo={setNodeVideo}
          nodeAudio={nodeAudio}
          setNodeAudio={setNodeAudio}
        />
      </div>
    );
  };

  export default Main;
  