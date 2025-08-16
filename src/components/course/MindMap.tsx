import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface MindMapNode {
  name: string;
  type?: string;
  children?: MindMapNode[];
}

interface MindMapProps {
  data: {
    root: MindMapNode;
  };
}

const nodeTypes = {};

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!data?.root) return { initialNodes: [], initialEdges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;

    const processNode = (
      node: MindMapNode,
      x: number,
      y: number,
      level: number,
      parentId?: string
    ): string => {
      const currentId = `node-${nodeId++}`;
      
      // Create node
      // Determine node styling based on type and level
      const getNodeStyle = (nodeType: string, level: number) => {
        const baseStyle = {
          fontWeight: level === 0 ? 'bold' : 'normal',
          fontSize: level === 0 ? '16px' : level === 1 ? '14px' : '12px',
          borderRadius: '12px',
          padding: level === 0 ? '12px 16px' : '8px 12px',
          border: '2px solid transparent',
          color: 'white',
          minWidth: level === 0 ? '120px' : '80px',
          textAlign: 'center' as const,
        };

        // Enhanced color scheme based on node types
        switch (nodeType) {
          case 'root':
            return { ...baseStyle, background: 'hsl(var(--primary))', border: '2px solid hsl(var(--primary-foreground))' };
          case 'concept':
            return { ...baseStyle, background: 'hsl(220, 70%, 50%)', border: '2px solid hsl(220, 70%, 40%)' };
          case 'application':
            return { ...baseStyle, background: 'hsl(160, 60%, 45%)', border: '2px solid hsl(160, 60%, 35%)' };
          case 'best-practice':
            return { ...baseStyle, background: 'hsl(280, 60%, 50%)', border: '2px solid hsl(280, 60%, 40%)' };
          case 'principle':
            return { ...baseStyle, background: 'hsl(200, 65%, 45%)', border: '2px solid hsl(200, 65%, 35%)' };
          case 'scenario':
            return { ...baseStyle, background: 'hsl(140, 55%, 45%)', border: '2px solid hsl(140, 55%, 35%)' };
          case 'solution':
            return { ...baseStyle, background: 'hsl(180, 50%, 45%)', border: '2px solid hsl(180, 50%, 35%)' };
          case 'detail':
            return { ...baseStyle, background: 'hsl(240, 45%, 55%)', border: '2px solid hsl(240, 45%, 45%)' };
          case 'example':
            return { ...baseStyle, background: 'hsl(120, 50%, 50%)', border: '2px solid hsl(120, 50%, 40%)' };
          case 'warning':
            return { ...baseStyle, background: 'hsl(350, 65%, 50%)', border: '2px solid hsl(350, 65%, 40%)' };
          case 'optimization':
            return { ...baseStyle, background: 'hsl(40, 70%, 50%)', border: '2px solid hsl(40, 70%, 40%)' };
          case 'testing':
            return { ...baseStyle, background: 'hsl(260, 55%, 50%)', border: '2px solid hsl(260, 55%, 40%)' };
          default:
            // Fallback to level-based coloring
            return {
              ...baseStyle,
              background: level === 0 ? 'hsl(var(--primary))' : level === 1 ? 'hsl(200, 60%, 50%)' : 'hsl(220, 40%, 60%)',
            };
        }
      };

      nodes.push({
        id: currentId,
        type: 'default',
        position: { x, y },
        data: { 
          label: node.name,
          type: node.type || 'default',
          level: level 
        },
        style: getNodeStyle(node.type || 'default', level),
      });

      // Create edge to parent with enhanced styling
      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'smoothstep',
          animated: level <= 1, // Animate edges for root and first level
          style: {
            stroke: level === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            strokeWidth: level === 0 ? 3 : 2,
          },
          markerEnd: {
            type: 'arrowclosed' as const,
            color: level === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
          },
        });
      }

      // Process children with improved spacing
      if (node.children && node.children.length > 0) {
        const childSpacing = Math.max(180, 220 - (level * 20)); // Adaptive spacing
        const startY = y - ((node.children.length - 1) * childSpacing) / 2;
        
        node.children.forEach((child, index) => {
          const childY = startY + index * childSpacing;
          const childX = x + (level === 0 ? 300 : 250); // More space from root
          processNode(child, childX, childY, level + 1, currentId);
        });
      }

      return currentId;
    };

    // Start processing from root
    processNode(data.root, 0, 0, 0);

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node.data);
    // Future: Add interaction like highlighting related content
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }} className="border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        attributionPosition="top-right"
        className="react-flow-mindmap"
      >
        <Controls className="react-flow-controls" />
        <MiniMap 
          className="react-flow-minimap"
          nodeColor={(node) => {
            const level = node.data?.level || 0;
            return level === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))';
          }}
          maskColor="hsl(var(--background) / 0.8)"
        />
        <Background 
          color="hsl(var(--muted))"
          size={1}
          gap={16}
        />
      </ReactFlow>
    </div>
  );
};

export default MindMap;