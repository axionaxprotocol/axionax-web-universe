import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
// import { createClient } from '@axionax/sdk'; // TODO: Enable when linked

export default function WalletScreen() {
    const [balance, setBalance] = useState('0.00');

    useEffect(() => {
        // Mock fetching balance
        setBalance('1,250.00');
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Wallet</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceValue}>{balance} AXX</Text>
                    <Text style={styles.usdValue}>≈ $625.00 USD</Text>
                </View>

                <Text style={styles.sectionTitle}>Recent Transactions</Text>

                <View style={styles.txItem}>
                    <View>
                        <Text style={styles.txType}>Rent: GPU Cluster A</Text>
                        <Text style={styles.txDate}>Today, 10:23 AM</Text>
                    </View>
                    <Text style={styles.txAmountNegative}>-9.00 AXX</Text>
                </View>

                <View style={styles.txItem}>
                    <View>
                        <Text style={styles.txType}>Deposit</Text>
                        <Text style={styles.txDate}>Yesterday, 4:15 PM</Text>
                    </View>
                    <Text style={styles.txAmountPositive}>+500.00 AXX</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#4F46E5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContent: {
        padding: 20,
    },
    balanceCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        marginTop: -40,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    usdValue: {
        fontSize: 16,
        color: '#999',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    txItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    txType: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    txDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    txAmountNegative: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
    txAmountPositive: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10B981',
    },
});
