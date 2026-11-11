export const paragraphClass = 'text-[16px] font-normal leading-[160%] text-blog';
export const headingClass =
  'text-[26px] md:text-[40px] font-normal leading-[110%] tracking-tighter font-heading text-heading mb-5';
export const h3Class = 'text-[24px] font-normal leading-[110%] tracking-tighter font-heading text-heading mb-3 mt-8';
export const h4Class = 'text-[15px] font-sans font-medium leading-[130%] text-heading mb-2 mt-6';

export function formatTableCell(cell: string): string {
  return cell
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
