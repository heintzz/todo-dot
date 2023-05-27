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
  const now = new Date(dt)
  const date = now.getDate();
  const month = monthList[now.getMonth()];
  const year = now.getFullYear();

  return `${date} ${month} ${year}`;
};

export default getDate;
