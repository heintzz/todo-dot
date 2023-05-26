const monthList = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const getDate = (dt: Date) => {
  const date = dt.getDate();
  const month = monthList[dt.getMonth()];
  const year = dt.getFullYear();

  return `${date} ${month} ${year}`;
};

export default getDate;
