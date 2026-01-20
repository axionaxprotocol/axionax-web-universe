import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const MOCK_NODES = [
    { id: '1', name: 'GPU Cluster A', specs: '8x NVIDIA A100', price: '4.5 AXX/hr' },
    { id: '2', name: 'CPU Compute B', specs: '128 vCPU, 512GB RAM', price: '2.25 AXX/hr' },
    { id: '3', name: 'Storage Node X', specs: '1PB SSD NVMe', price: '0.5 AXX/hr' },
];

export default function MarketScreen() {
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.nodeName}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
            <Text style={styles.specs}>{item.specs}</Text>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Rent Now</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Marketplace</Text>
            </View>
            <FlatList
                data={MOCK_NODES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
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
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    nodeName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
    },
    specs: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4F46E5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});
