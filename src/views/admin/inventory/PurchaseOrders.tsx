import { useState } from 'react';
import { usePurchaseOrders } from '../../../hooks/useInventory';
import type { PurchaseOrder } from '../../../types/inventory';

export default function PurchaseOrders() {
  const { purchaseOrders, loading, receivePurchaseOrder } = usePurchaseOrders();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);

  const handleReceive = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setShowReceiveDialog(true);
  };

  const handleSubmitReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const items = selectedPO.items.map((item) => ({
        id: item.id!,
        quantity_received: parseInt(formData.get(`qty_${item.id}`) as string) || 0,
      }));

      await receivePurchaseOrder(selectedPO.id, items);
      setShowReceiveDialog(false);
      setSelectedPO(null);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to receive purchase order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      partially_received: 'bg-yellow-100 text-yellow-800',
      received: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create PO
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseOrders.map((po) => (
              <tr key={po.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{po.po_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{po.supplier?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(po.order_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {po.expected_delivery ? new Date(po.expected_delivery).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${po.total_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(po.status)}`}>
                    {po.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {(po.status === 'sent' || po.status === 'partially_received') && (
                    <button
                      onClick={() => handleReceive(po)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Receive
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receive Dialog */}
      {showReceiveDialog && selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Receive Purchase Order: {selectedPO.po_number}
            </h2>

            <form onSubmit={handleSubmitReceive} className="space-y-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ordered</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Received</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Receive Now</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedPO.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.product?.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{item.quantity_ordered}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{item.quantity_received}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name={`qty_${item.id}`}
                          min="0"
                          max={item.quantity_ordered - item.quantity_received}
                          defaultValue={item.quantity_ordered - item.quantity_received}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReceiveDialog(false);
                    setSelectedPO(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Receive Items
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
