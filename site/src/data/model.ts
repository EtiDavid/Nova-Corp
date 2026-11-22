import entities from "./entities.json";
import relationships from "./relationships.json";

export type Entity = (typeof entities)[number];
export type Relationship = (typeof relationships)[number];
export const systems: Entity[] = entities;
export const edges: Relationship[] = relationships;
export const getSystem = (id: string) => systems.find((item) => item.id === id);
export const connectedTo = (id: string) => {
  return edges.filter((edge) => edge.from === id || edge.to === id).map((edge) => ({
    ...edge,
    other: getSystem(edge.from === id ? edge.to : edge.from)
  })).filter((edge) => edge.other !== undefined);
};
