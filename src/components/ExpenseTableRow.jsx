import React from 'react';
import { Button, Modal, Dropdown } from 'react-bootstrap';
import AddExpense from './AddExpense';
import DeleteExpense from './DeleteExpense';
import { FaEllipsisVertical } from 'react-icons/fa6';

const ExpenseTableRow = ({
  expense,
  isEditing,
  editedData,
  selectedSubcategory,
  handleInputChange,
  handleSaveClick,
  handleEditClick,
  subcategories,
  setSelectedSubcategory,
  onExpenseDeleted,
  handleAddExpenseClick,
  showAddExpenseModal,
  handleCloseAddExpenseModal,
  updateTableData,
}) => (
  <>
    {expense.expenses.map((expenseItem) => (
      <tr key={expenseItem._id}>
        <td>
          {isEditing[expenseItem._id] ? (
            <input
              type="text"
              name="title"
              value={editedData[expenseItem._id]?.title || ''}
              onChange={(e) => handleInputChange(e, expenseItem._id)}
              style={{ textAlign: 'center' }}
            />
          ) : (
            expenseItem.title
          )}
        </td>
        <td>
          {isEditing[expenseItem._id] ? (
            <div>{selectedSubcategory[expenseItem._id] || ''}</div>
          ) : (
            selectedSubcategory[expenseItem._id] || expenseItem.categoryName
          )}
        </td>
        <td>
          {isEditing[expenseItem._id] ? (
            <select
              name="subCategoryName"
              value={editedData[expenseItem._id]?.subCategoryName || ''}
              onChange={(e) => {
                handleInputChange(e, expenseItem._id);
                const selectedValue = e.target.value;
                const selectedCategory = subcategories.find(
                  (subCategory) => subCategory.subCategoryName === selectedValue
                );
                setSelectedSubcategory({
                  ...selectedSubcategory,
                  [expenseItem._id]: selectedCategory?.categoryName || '',
                });
              }}
            >
              {subcategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory.subCategoryName}>
                  {subCategory.subCategoryName}
                </option>
              ))}
            </select>
          ) : (
            expenseItem.subCategoryName
          )}
        </td>
        <td>
          {isEditing[expenseItem._id] ? (
            <input
              type="number"
              name="quantity"
              min="1"
              max="99"
              value={editedData[expenseItem._id]?.quantity || ''}
              onChange={(e) => handleInputChange(e, expenseItem._id)}
              style={{ textAlign: 'center' }}
            />
          ) : (
            expenseItem.quantity
          )}
        </td>
        <td>
          {isEditing[expenseItem._id] ? (
            <input
              type="number"
              name="amount"
              value={editedData[expenseItem._id]?.amount || ''}
              onChange={(e) => handleInputChange(e, expenseItem._id)}
              style={{ textAlign: 'center' }}
            />
          ) : (
            expenseItem.amount
          )}
        </td>
        <td>{expenseItem.totalAmountInArray}</td>
        <td>
          {isEditing[expenseItem._id] ? (
            <input
              type="text"
              name="description"
              value={editedData[expenseItem._id]?.description || ''}
              onChange={(e) => handleInputChange(e, expenseItem._id)}
              style={{ textAlign: 'center' }}
            />
          ) : (
            expenseItem.description
          )}
        </td>
        <td>
          {isEditing[expenseItem._id] ? (
            <Button onClick={() => handleSaveClick(expenseItem._id)}>Save</Button>
          ) : (
            <Dropdown className="action">
              <Dropdown.Toggle>
                <FaEllipsisVertical style={{ color: '#0D0D0D' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ padding: '0px' }}>
                <Button
                  variant="primary"
                  onClick={() => handleEditClick(expenseItem._id)}
                  style={{ width: '100%' }}
                >
                  Edit
                </Button>
                <DeleteExpense
                  expenseId={expenseItem._id}
                  onExpenseDeleted={onExpenseDeleted}
                />
              </Dropdown.Menu>
            </Dropdown>
          )}
        </td>
      </tr>
    ))}

    <Modal show={showAddExpenseModal} onHide={handleCloseAddExpenseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Render the AddExpense component here */}
        <AddExpense date={expense.date} onExpenseAdded={updateTableData} />
      </Modal.Body>
    </Modal>
  </>
);

export default ExpenseTableRow;
