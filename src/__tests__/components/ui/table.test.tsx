import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';

describe('Table components', () => {
  describe('Table', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const table = document.querySelector('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass('w-full');
      expect(table).toHaveClass('caption-bottom');
    });

    it('applies custom classes', () => {
      render(
        <Table className="custom-table-class">
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const table = document.querySelector('table');
      expect(table).toHaveClass('custom-table-class');
    });

    it('renders within a div wrapper for overflow handling', () => {
      const { container } = render(<Table />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('relative');
      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveClass('overflow-auto');
    });
  });

  describe('TableHeader', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const thead = document.querySelector('thead');
      expect(thead).toBeInTheDocument();
      expect(thead).toHaveClass('[&_tr]:border-b');
    });

    it('applies custom classes', () => {
      render(
        <Table>
          <TableHeader className="custom-header-class">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const thead = document.querySelector('thead');
      expect(thead).toHaveClass('custom-header-class');
    });
  });

  describe('TableBody', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const tbody = document.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
      expect(tbody).toHaveClass('[&_tr:last-child]:border-0');
    });

    it('applies custom classes', () => {
      render(
        <Table>
          <TableBody className="custom-body-class">
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const tbody = document.querySelector('tbody');
      expect(tbody).toHaveClass('custom-body-class');
    });
  });

  describe('TableFooter', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Footer Content</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      
      const tfoot = document.querySelector('tfoot');
      expect(tfoot).toBeInTheDocument();
      expect(tfoot).toHaveClass('border-t');
      expect(tfoot).toHaveClass('bg-muted/50');
    });

    it('applies custom classes', () => {
      render(
        <Table>
          <TableFooter className="custom-footer-class">
            <TableRow>
              <TableCell>Footer Content</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      
      const tfoot = document.querySelector('tfoot');
      expect(tfoot).toHaveClass('custom-footer-class');
    });
  });

  describe('TableRow', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const tr = document.querySelector('tr');
      expect(tr).toBeInTheDocument();
      expect(tr).toHaveClass('border-b');
      expect(tr).toHaveClass('hover:bg-muted/50');
    });

    it('applies custom classes', () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="custom-row-class">
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const tr = document.querySelector('tr');
      expect(tr).toHaveClass('custom-row-class');
    });
  });

  describe('TableHead', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const th = document.querySelector('th');
      expect(th).toBeInTheDocument();
      expect(th).toHaveClass('h-10');
      expect(th).toHaveClass('text-left');
      expect(th).toHaveClass('text-muted-foreground');
    });

    it('applies custom classes', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head-class">Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const th = document.querySelector('th');
      expect(th).toHaveClass('custom-head-class');
    });
  });

  describe('TableCell', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const td = document.querySelector('td');
      expect(td).toBeInTheDocument();
      expect(td).toHaveClass('p-2');
      expect(td).toHaveClass('align-middle');
    });

    it('applies custom classes', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell-class">Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const td = document.querySelector('td');
      expect(td).toHaveClass('custom-cell-class');
    });
  });

  describe('TableCaption', () => {
    it('renders correctly with default props', () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const caption = document.querySelector('caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveClass('mt-4');
      expect(caption).toHaveClass('text-sm');
      expect(caption).toHaveClass('text-muted-foreground');
      expect(caption).toHaveTextContent('Table Caption');
    });

    it('applies custom classes', () => {
      render(
        <Table>
          <TableCaption className="custom-caption-class">Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const caption = document.querySelector('caption');
      expect(caption).toHaveClass('custom-caption-class');
    });
  });
});