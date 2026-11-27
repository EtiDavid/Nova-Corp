import { useMemo } from "react";
import { ReactFlow, Background, Controls, MarkerType, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface GraphItem { id:string; name:string; category:string; slug:string; }
interface GraphLink { from:string; to:string; type:string; label:string; }
interface Props { items: GraphItem[]; links: GraphLink[]; base: string; }

const pos: Record<string, {x:number;y:number}> = {
  "nova-prox01": {x:275,y:10},
  "nova-client": {x:0,y:265},
  "nova-fw01": {x:260,y:190},
  "nova-dc01": {x:570,y:80},
  "nova-dc02": {x:570,y:220},
  "nova-files01": {x:570,y:360}
};

export default function ExplorerGraph({ items, links, base }: Props) {
  const ids = useMemo(() => new Set(items.map(item => item.id)), [items]);
  const nodes: Node[] = useMemo(() => items.map(item => ({
    id:item.id,
    position:pos[item.id] || {x:0,y:0},
    data:{label:item.name},
    style:{
      background:item.id==="nova-fw01"?"#EFF6FF":"#FFFFFF",
      color:"#0F172A",border:"1px solid #CBD5E1",borderRadius:12,
      fontSize:13,fontWeight:700,padding:"10px 12px",width:180,
      boxShadow:"0 5px 18px rgba(15,23,42,.08)"
    }
  })), [items]);
  const edges: Edge[] = useMemo(() => links.filter(link => ids.has(link.from) && ids.has(link.to)).map((link,index) => ({
    id:"connection-"+index,
    source:link.from,
    target:link.to,
    label:link.type === "hosts" ? undefined : link.label,
    type:"smoothstep",
    style:{stroke:"#94A3B8",strokeWidth:1.5},
    labelStyle:{fontSize:9,fill:"#475569"},
    markerEnd:{type:MarkerType.ArrowClosed,color:"#94A3B8",width:12,height:12}
  })), [links,ids]);
  return <div style={{height:450,width:"100%"}} aria-label="Interactive overview of documented virtual systems and their connections">
    <ReactFlow
      nodes={nodes} edges={edges}
      nodesDraggable={false} nodesConnectable={false}
      fitView fitViewOptions={{padding:0.2}}
      onNodeClick={(_,node) => {window.location.href=base+"systems/"+node.id+"/";}}
      attributionPosition="bottom-left"
      proOptions={{hideAttribution:false}}
    >
      <Background gap={22} size={1} color="#E2E8F0" />
      <Controls showInteractive={false} />
    </ReactFlow>
  </div>;
}
