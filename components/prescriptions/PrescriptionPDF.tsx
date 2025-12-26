import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: "#333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  clinicInfo: {
    fontSize: 10,
    color: "#666",
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    borderBottom: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 3,
  },
  patientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  infoGroup: {
    marginBottom: 3,
  },
  label: {
    fontWeight: "bold",
    fontSize: 10,
  },
  value: {
    fontSize: 10,
    color: "#444",
  },
  medicationsTable: {
    display: "flex",
    flexDirection: "column",
    marginTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    paddingVertical: 8,
  },
  col1: {
    width: "5%",
  },
  col2: {
    width: "30%",
  },
  col3: {
    width: "20%",
  },
  col4: {
    width: "20%",
  },
  col5: {
    width: "25%",
  },
  textContent: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    fontSize: 9,
    color: "#666",
  },
  signatureSection: {
    marginTop: 40,
    textAlign: "right",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    width: 200,
    marginTop: 50,
    marginLeft: "auto",
    paddingTop: 5,
  },
  date: {
    fontSize: 10,
    color: "#666",
    marginBottom: 10,
  },
});

interface PrescriptionPDFProps {
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientUHID?: string;
  date: string;
  doctorName: string;
  doctorQualification?: string;
  doctorRegistration?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  advice?: string;
  tests?: Array<{
    name: string;
    instructions?: string;
  }>;
  followUp?: string;
  notes?: string;
  header?: string;
  footer?: string;
}

export const PrescriptionPDF: React.FC<PrescriptionPDFProps> = ({
  patientName,
  patientAge,
  patientGender,
  patientUHID,
  date,
  doctorName,
  doctorQualification,
  doctorRegistration,
  clinicName,
  clinicAddress,
  clinicPhone,
  medications = [],
  advice,
  tests = [],
  followUp,
  notes,
  header,
  footer,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {header ? (
            <Text style={styles.textContent}>{header}</Text>
          ) : (
            <>
              <Text style={styles.title}>{clinicName || "Medical Clinic"}</Text>
              <Text style={styles.clinicInfo}>
                {doctorName}
                {doctorQualification && `, ${doctorQualification}`}
              </Text>
              {doctorRegistration && (
                <Text style={styles.clinicInfo}>
                  Reg. No: {doctorRegistration}
                </Text>
              )}
              {clinicAddress && (
                <Text style={styles.clinicInfo}>{clinicAddress}</Text>
              )}
              {clinicPhone && (
                <Text style={styles.clinicInfo}>Phone: {clinicPhone}</Text>
              )}
            </>
          )}
        </View>

        {/* Date */}
        <Text style={styles.date}>
          Date: {new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>

        {/* Patient Information */}
        <View style={styles.patientInfo}>
          <View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Patient Name:</Text>
              <Text style={styles.value}>{patientName}</Text>
            </View>
            {patientUHID && (
              <View style={styles.infoGroup}>
                <Text style={styles.label}>UHID:</Text>
                <Text style={styles.value}>{patientUHID}</Text>
              </View>
            )}
          </View>
          <View>
            {patientAge && (
              <View style={styles.infoGroup}>
                <Text style={styles.label}>Age:</Text>
                <Text style={styles.value}>{patientAge} years</Text>
              </View>
            )}
            {patientGender && (
              <View style={styles.infoGroup}>
                <Text style={styles.label}>Gender:</Text>
                <Text style={styles.value}>{patientGender}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Medications */}
        {medications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>℞ Medications</Text>
            <View style={styles.medicationsTable}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.col1}>#</Text>
                <Text style={styles.col2}>Medicine</Text>
                <Text style={styles.col3}>Dosage</Text>
                <Text style={styles.col4}>Frequency</Text>
                <Text style={styles.col5}>Duration</Text>
              </View>
              {medications.map((med, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>{index + 1}</Text>
                  <Text style={styles.col2}>{med.name}</Text>
                  <Text style={styles.col3}>{med.dosage}</Text>
                  <Text style={styles.col4}>{med.frequency}</Text>
                  <Text style={styles.col5}>{med.duration}</Text>
                </View>
              ))}
            </View>
            {medications.some((m) => m.instructions) && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>
                  Instructions:
                </Text>
                {medications
                  .filter((m) => m.instructions)
                  .map((med, index) => (
                    <Text key={index} style={{ fontSize: 9, marginBottom: 2 }}>
                      • {med.name}: {med.instructions}
                    </Text>
                  ))}
              </View>
            )}
          </View>
        )}

        {/* Tests/Investigations */}
        {tests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investigations</Text>
            {tests.map((test, index) => (
              <View key={index} style={{ marginBottom: 3 }}>
                <Text style={styles.textContent}>
                  {index + 1}. {test.name}
                  {test.instructions && ` - ${test.instructions}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Advice */}
        {advice && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Advice</Text>
            <Text style={styles.textContent}>{advice}</Text>
          </View>
        )}

        {/* Follow-up */}
        {followUp && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Follow-up</Text>
            <Text style={styles.textContent}>{followUp}</Text>
          </View>
        )}

        {/* Notes */}
        {notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.textContent}>{notes}</Text>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureLine}>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              {doctorName}
            </Text>
            {doctorQualification && (
              <Text style={{ fontSize: 9 }}>{doctorQualification}</Text>
            )}
            {doctorRegistration && (
              <Text style={{ fontSize: 9 }}>Reg: {doctorRegistration}</Text>
            )}
          </View>
        </View>

        {/* Footer */}
        {footer && (
          <View style={styles.footer}>
            <Text>{footer}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
