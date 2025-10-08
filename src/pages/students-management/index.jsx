import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';



// Import components
import SearchAndFilters from './components/SearchAndFilters';
import AdvancedFiltersPanel from './components/AdvancedFiltersPanel';
import BulkActionsBar from './components/BulkActionsBar';
import StudentsTable from './components/StudentsTable';
import StudentDetailsModal from './components/StudentDetailsModal';
import Pagination from './components/Pagination';

const StudentsManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock user data
  const user = {
    name: "Sarah Johnson",
    role: "Administrator"
  };

  // Updated mock students data to match Nigerian education system
  const mockStudents = [
    {
      id: 1,
      studentId: "STU001",
      firstName: "Emma",
      lastName: "Thompson", 
      gender: "Female",
      class: "Primary 5",
      classId: "primary_5",
      dateOfBirth: "2014-03-15",
      parentName: "Michael Thompson",
      parentPhone: "+1 (555) 123-4567",
      parentEmail: "michael.thompson@email.com",
      address: "123 Oak Street, Springfield, IL 62701",
      enrollmentDate: "2024-08-15",
      feeStatus: "paid",
      rollNumber: "05A001"
    },
    {
      id: 2,
      studentId: "STU002",
      firstName: "James",
      lastName: "Wilson",
      gender: "Male",
      class: "JSS 2",
      classId: "jss_2",
      dateOfBirth: "2012-07-22",
      parentName: "Jennifer Wilson",
      parentPhone: "+1 (555) 234-5678",
      parentEmail: "jennifer.wilson@email.com",
      address: "456 Pine Avenue, Springfield, IL 62702",
      enrollmentDate: "2024-08-16",
      feeStatus: "pending",
      rollNumber: "07A002"
    },
    {
      id: 3,
      studentId: "STU003",
      firstName: "Sophia",
      lastName: "Davis",
      gender: "Female",
      class: "Nursery 3",
      classId: "nursery_3",
      dateOfBirth: "2016-11-08",
      parentName: "Robert Davis",
      parentPhone: "+1 (555) 345-6789",
      parentEmail: "robert.davis@email.com",
      address: "789 Maple Drive, Springfield, IL 62703",
      enrollmentDate: "2024-08-17",
      feeStatus: "overdue",
      rollNumber: "03A003"
    },
    {
      id: 4,
      studentId: "STU004",
      firstName: "Liam",
      lastName: "Brown",
      gender: "Male",
      class: "Primary 6",
      classId: "primary_6",
      dateOfBirth: "2013-05-12",
      parentName: "Lisa Brown",
      parentPhone: "+1 (555) 456-7890",
      parentEmail: "lisa.brown@email.com",
      address: "321 Elm Street, Springfield, IL 62704",
      enrollmentDate: "2024-08-18",
      feeStatus: "paid",
      rollNumber: "06A004"
    },
    {
      id: 5,
      studentId: "STU005",
      firstName: "Olivia",
      lastName: "Miller",
      gender: "Female",
      class: "Primary 4",
      classId: "primary_4",
      dateOfBirth: "2015-09-30",
      parentName: "David Miller",
      parentPhone: "+1 (555) 567-8901",
      parentEmail: "david.miller@email.com",
      address: "654 Cedar Lane, Springfield, IL 62705",
      enrollmentDate: "2024-08-19",
      feeStatus: "pending",
      rollNumber: "04A005"
    },
    {
      id: 6,
      studentId: "STU006",
      firstName: "Noah",
      lastName: "Garcia",
      gender: "Male",
      class: "SSS 1",
      classId: "sss_1",
      dateOfBirth: "2011-12-03",
      parentName: "Maria Garcia",
      parentPhone: "+1 (555) 678-9012",
      parentEmail: "maria.garcia@email.com",
      address: "987 Birch Road, Springfield, IL 62706",
      enrollmentDate: "2024-08-20",
      feeStatus: "overdue",
      rollNumber: "08A006"
    },
    {
      id: 7,
      studentId: "STU007",
      firstName: "Ava",
      lastName: "Rodriguez",
      gender: "Female",
      class: "Nursery 2",
      classId: "nursery_2",
      dateOfBirth: "2017-04-18",
      parentName: "Carlos Rodriguez",
      parentPhone: "+1 (555) 789-0123",
      parentEmail: "carlos.rodriguez@email.com",
      address: "147 Willow Street, Springfield, IL 62707",
      enrollmentDate: "2024-08-21",
      feeStatus: "paid",
      rollNumber: "02A007"
    },
    {
      id: 8,
      studentId: "STU008",
      firstName: "William",
      lastName: "Martinez",
      gender: "Male",
      class: "SSS 3",
      classId: "sss_3",
      dateOfBirth: "2010-08-25",
      parentName: "Ana Martinez",
      parentPhone: "+1 (555) 890-1234",
      parentEmail: "ana.martinez@email.com",
      address: "258 Spruce Avenue, Springfield, IL 62708",
      enrollmentDate: "2024-08-22",
      feeStatus: "pending",
      rollNumber: "09A008"
    },
    {
      id: 9,
      studentId: "STU009",
      firstName: "Isabella",
      lastName: "Anderson",
      gender: "Female",
      class: "Primary 1",
      classId: "primary_1",
      dateOfBirth: "2018-01-14",
      parentName: "Thomas Anderson",
      parentPhone: "+1 (555) 901-2345",
      parentEmail: "thomas.anderson@email.com",
      address: "369 Poplar Drive, Springfield, IL 62709",
      enrollmentDate: "2024-08-23",
      feeStatus: "paid",
      rollNumber: "01A009"
    },
    {
      id: 10,
      studentId: "STU010",
      firstName: "Benjamin",
      lastName: "Taylor",
      gender: "Male",
      class: "JSS 1",
      classId: "jss_1",
      dateOfBirth: "2009-06-07",
      parentName: "Michelle Taylor",
      parentPhone: "+1 (555) 012-3456",
      parentEmail: "michelle.taylor@email.com",
      address: "741 Ash Street, Springfield, IL 62710",
      enrollmentDate: "2024-08-24",
      feeStatus: "overdue",
      rollNumber: "10A010"
    },
    {
      id: 11,
      studentId: "STU011",
      firstName: "Aisha",
      lastName: "Musa",
      gender: "Female",
      class: "Creche",
      classId: "creche",
      dateOfBirth: "2019-05-12",
      parentName: "Fatima Musa",
      parentPhone: "+1 (555) 111-2222",
      parentEmail: "fatima.musa@email.com",
      address: "456 Green Street, Springfield, IL 62711",
      enrollmentDate: "2024-08-25",
      feeStatus: "paid",
      rollNumber: "CR001"
    },
    {
      id: 12,
      studentId: "STU012",
      firstName: "Chidi",
      lastName: "Okwu",
      gender: "Male",
      class: "Primary 2",
      classId: "primary_2",
      dateOfBirth: "2017-09-18",
      parentName: "Grace Okwu",
      parentPhone: "+1 (555) 333-4444",
      parentEmail: "grace.okwu@email.com",
      address: "789 Blue Avenue, Springfield, IL 62712",
      enrollmentDate: "2024-08-26",
      feeStatus: "pending",
      rollNumber: "02A012"
    }
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    class: 'all',
    gender: 'all',
    feeStatus: 'all'
  });
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    let filtered = mockStudents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(student =>
        `${student?.firstName} ${student?.lastName}`?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        student?.studentId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        student?.parentName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply basic filters
    if (activeFilters?.class !== 'all') {
      filtered = filtered?.filter(student => student?.class === activeFilters?.class);
    }
    if (activeFilters?.gender !== 'all') {
      filtered = filtered?.filter(student => student?.gender === activeFilters?.gender);
    }
    if (activeFilters?.feeStatus !== 'all') {
      filtered = filtered?.filter(student => student?.feeStatus === activeFilters?.feeStatus);
    }

    // Apply advanced filters - removed age and parent phone filters
    if (advancedFilters?.enrollmentDateFrom) {
      filtered = filtered?.filter(student => 
        new Date(student.enrollmentDate) >= new Date(advancedFilters.enrollmentDateFrom)
      );
    }
    if (advancedFilters?.enrollmentDateTo) {
      filtered = filtered?.filter(student => 
        new Date(student.enrollmentDate) <= new Date(advancedFilters.enrollmentDateTo)
      );
    }
    if (advancedFilters?.specificClass && advancedFilters?.specificClass !== 'all') {
      filtered = filtered?.filter(student => 
        student?.class === advancedFilters?.specificClass
      );
    }

    return filtered;
  }, [mockStudents, searchTerm, activeFilters, advancedFilters]);

  // Sort logic
  const sortedStudents = useMemo(() => {
    const sorted = [...filteredStudents];
    sorted?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig?.key) {
        case 'name':
          aValue = `${a?.firstName} ${a?.lastName}`;
          bValue = `${b?.firstName} ${b?.lastName}`;
          break;
        case 'class':
          aValue = a?.class;
          bValue = b?.class;
          break;
        case 'enrollmentDate':
          aValue = new Date(a.enrollmentDate);
          bValue = new Date(b.enrollmentDate);
          break;
        default:
          aValue = a?.[sortConfig?.key];
          bValue = b?.[sortConfig?.key];
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredStudents, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents?.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedStudents?.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedStudents, currentPage, itemsPerPage]);

  // Event handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev?.includes(studentId)
        ? prev?.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(prev =>
      prev?.length === paginatedStudents?.length
        ? []
        : paginatedStudents?.map(student => student?.id)
    );
  };

  const handleEditStudent = (student) => {
    navigate('/add-edit-student', { state: { student } });
  };

  const handleDeleteStudent = (studentId) => {
    // In a real app, this would make an API call
    console.log('Deleting student:', studentId);
    setSelectedStudents(prev => prev?.filter(id => id !== studentId));
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleBulkDelete = () => {
    console.log('Bulk deleting students:', selectedStudents);
    setSelectedStudents([]);
  };

  const handleBulkClassTransfer = (newClass) => {
    console.log('Transferring students to class:', newClass, selectedStudents);
    setSelectedStudents([]);
  };

  const handleBulkInvoiceGeneration = () => {
    navigate('/create-invoice', { state: { selectedStudents } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedStudents([]); // Clear selection when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedStudents([]);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedStudents([]);
  }, [searchTerm, activeFilters, advancedFilters]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
        
        <main className="p-6">
          <Breadcrumb customItems={[]} />
          
          <PageHeader
            title="Students Management"
            subtitle={`Manage ${sortedStudents?.length} student records with comprehensive tools`}
            icon="Users"
            actions={
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/bulk-student-import')}
                  iconName="Upload"
                  iconPosition="left"
                  iconSize={16}
                >
                  Bulk Import
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/add-edit-student')}
                  iconName="UserPlus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add Student
                </Button>
              </div>
            }
          />

          {/* Search and Filters */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            onAdvancedFiltersToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
            showAdvancedFilters={showAdvancedFilters}
          />

          {/* Bulk Actions Bar */}
          <BulkActionsBar
            selectedCount={selectedStudents?.length}
            onClearSelection={() => setSelectedStudents([])}
            onBulkDelete={handleBulkDelete}
            onBulkClassTransfer={handleBulkClassTransfer}
            onBulkInvoiceGeneration={handleBulkInvoiceGeneration}
          />

          {/* Students Table */}
          <StudentsTable
            students={paginatedStudents}
            selectedStudents={selectedStudents}
            onSelectStudent={handleSelectStudent}
            onSelectAll={handleSelectAll}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewStudent={handleViewStudent}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedStudents?.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />

          {/* Advanced Filters Panel */}
          <AdvancedFiltersPanel
            isOpen={showAdvancedFilters}
            onClose={() => setShowAdvancedFilters(false)}
            onApplyFilters={setAdvancedFilters}
            currentFilters={advancedFilters}
          />

          {/* Student Details Modal */}
          <StudentDetailsModal
            student={selectedStudent}
            isOpen={showStudentModal}
            onClose={() => {
              setShowStudentModal(false);
              setSelectedStudent(null);
            }}
            onEdit={handleEditStudent}
          />
        </main>
      </div>
    </div>
  );
};

export default StudentsManagement;