export const removeField = (idx, noOfFields, setNoOfFields) => {
    let deletedFieldCount = [...noOfFields]
    deletedFieldCount.splice(idx, 1)
    setNoOfFields(deletedFieldCount)
}