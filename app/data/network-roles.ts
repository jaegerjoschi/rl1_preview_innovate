/**
 * „The Regulated Layer One Network" — die drei Rollen auf /about.
 *
 * SWIAT ist in Runde 2 entfallen: die Betreibergesellschaft ist keine
 * Rolle im Netzwerk, sondern der technische Dienstleister. Sie steht
 * weiterhin im Netzwerkdiagramm unter den Validatoren.
 */
export type NetworkRole = {
  id: string;
  title: string;
  body: string;
  /** Rolle in data/participants.ts, aus der die Logos gezogen werden */
  role: "member" | "validator" | "supporter";
};

export const networkRoles: NetworkRole[] = [
  {
    id: "members",
    title: "Members",
    body: "The banks and financial institutions that own, steer and fund the cooperative.",
    role: "member",
  },
  {
    id: "validators",
    title: "Validators",
    body: "Authorized institutions that validate transactions and help secure the network according to agreed governance and technical standards.",
    role: "validator",
  },
  {
    // Runde 11: sichtbarer Titel „Supporters" statt „Observers" (Wunsch
    // des Auftraggebers). `id` und `role` bleiben — reine Code-Schlüssel.
    id: "observers",
    title: "Supporters",
    body: "Public institutions, regulators and ecosystem partners who contribute expertise and guidance without voting rights.",
    role: "supporter",
  },
];
