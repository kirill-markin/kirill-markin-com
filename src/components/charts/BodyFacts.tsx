import type { ReactElement } from "react";
import { HEIGHT_CM, VCARD_DATA } from "@/data/contacts";

const computeAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

type Fact = Readonly<{
  label: string;
  value: string;
}>;

const buildFacts = (): ReadonlyArray<Fact> => [
  { label: "Height", value: `${HEIGHT_CM} cm` },
  { label: "Date of birth", value: VCARD_DATA.birthday },
  { label: "Age", value: `${computeAge(VCARD_DATA.birthday)}` },
];

const styles = {
  list: {
    listStyle: "none" as const,
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column" as const,
    border: "1px solid #ddd",
    borderRadius: "0",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "10px 14px",
    fontSize: "13px",
    borderBottom: "1px solid #ddd",
  },
  rowLast: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "10px 14px",
    fontSize: "13px",
  },
  label: {
    color: "#898989",
  },
  value: {
    fontWeight: 600,
    textAlign: "right" as const,
  },
} as const;

export const BodyFacts = (): ReactElement => {
  const facts = buildFacts();

  return (
    <ul style={styles.list}>
      {facts.map((fact, index) => (
        <li
          key={fact.label}
          style={index < facts.length - 1 ? styles.row : styles.rowLast}
        >
          <span style={styles.label}>{fact.label}</span>
          <span style={styles.value}>{fact.value}</span>
        </li>
      ))}
    </ul>
  );
};
