import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>axionax Universe</Text>
                    <Text style={styles.subtitle}>Mobile Dashboard</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Network Status</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Status</Text>
                        <Text style={styles.valueActive}>● Online</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Block Height</Text>
                        <Text style={styles.value}>#12,453,221</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Active Nodes</Text>
                        <Text style={styles.value}>1,240</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>My Activity</Text>
                    <Text style={styles.placeholderText}>No recent activity</Text>
                </View>
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 5,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    valueActive: {
        fontSize: 16,
        fontWeight: '500',
        color: '#10B981',
    },
    placeholderText: {
        color: '#999',
        fontStyle: 'italic',
    },
});
