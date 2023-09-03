export function DeliveryDate(preparingDateStr, daysNumber) {
  if (typeof preparingDateStr === 'string') {
    const parts = preparingDateStr.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);

    const newDate = new Date(year, month, day); 

    newDate.setDate(newDate.getDate() + daysNumber);
    const formattedDate = newDate.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });

    return formattedDate;
  }
  return NaN;
}