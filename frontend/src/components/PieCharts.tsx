import { PieChart } from '@mantine/charts';

export function PieCharts() {
  return <PieChart withLabelsLine labelsPosition="inside" labelsType="value" withLabels data={[
    { name: 'USA', value: 400, color: 'indigo.6' },
    { name: 'India', value: 300, color: 'yellow.6' },
    { name: 'Japan', value: 300, color: 'teal.6' },
    { name: 'Other', value: 200, color: 'gray.6' },
  ]} />;
}