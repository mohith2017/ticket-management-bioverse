import React, { useEffect, useState } from 'react';
import BugReportIcon from '@mui/icons-material/BugReport';
import axios from 'axios';
import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Collapse,
  ListItemIcon,
  FormControlLabel,
  Radio,
  TextareaAutosize,
  RadioGroup,
} from '@mui/material';
import { ExpandLess, ExpandMore, Inbox as InboxIcon } from '@mui/icons-material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface Ticket {
  resp: string;
  name: string;
  email: string;
  desc: string;
  status: string;
  timestamp: Date;
}

const formSchema = z.object({
  resp: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
});

type FormData = z.infer<typeof formSchema>;

const TicketNew: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = useState<string>();
  const [resultColor, setResultColor] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>(ticket.status);

  const handleClick = () => {
    setOpen(!open);
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'red'; // Set to the desired color for 'New'
      case 'progress':
        return 'yellow'; // Set to the desired color for 'In Progress'
      case 'resolved':
        return 'green'; // Set to the desired color for 'Resolved'
      default:
        return 'blue'; // Set a default color if the status is not recognized
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const processForm = async (data: FormData) => {
    const config = {
      method: "post",
      url: "/api/response",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ...data,
        name: ticket.name,
        email: ticket.email,
        desc: ticket.desc,
        status: ticket.status,
        timestamp: ticket.timestamp, // Include the timestamp from the ticket
      },
    };
    
    try {
      const response = await axios(config);
      if (response.status === 200) {
        setResult(
          "Your response has been sent. Thank you for being a part of Bioverse!"
        );
        setResultColor("text-green-500");
        reset();
      }
    } catch (err: any) {
      setResult(err.response?.data.message + ": " + err.response?.statusText);
      setResultColor("text-red-500");
    }
  };

  
  const updateStatus = async (newStatus: string) => {
    setSelectedStatus(newStatus); // Update the selectedStatus when the radio is clicked

    const statusConfig = {
      method: "post",
      url: "/api/status", // Use the correct endpoint for updating the status
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: ticket.name,
        email: ticket.email,
        desc: ticket.desc,
        status: newStatus,
        timestamp: ticket.timestamp,
      },
    };

    try {
      const response = await axios(statusConfig);
      if (response.status === 200) {
        setResult(`Ticket status updated to ${newStatus}`);
        setResultColor("text-green-500");
      }
    } catch (err: any) {
      setResult(err.response?.data.message + ": " + err.response?.statusText);
      setResultColor("text-red-500");
    }
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListSubheader component="div" id="nested-list-subheader">
        Ticket
      </ListSubheader>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <BugReportIcon sx={{ backgroundColor: getIconColor(ticket.status) }}/>
        </ListItemIcon>
        <ListItemText primary="New" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <div className="flex-col items-center">
              <ListItemText primary={`Ticket: ${ticket.desc}`} className="font-mono mr-2" />
              <ListItemText primary={`Response: ${ticket.resp}`} className="font-mono mr-2" />
              <div className="px-3">
                <TextareaAutosize
                  className={`shadow appearance-none outline border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-300`}
                  placeholder="Response"
                  {...register('resp')}
                ></TextareaAutosize>

                <button
                  className={`${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 cursor-pointer"
                  } bg-white hover:bg-gray-400 text-black font-bold mx-3 py-2 px-6 rounded focus:outline-none focus:shadow-outline duration-300`}
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(processForm)}
                >
                  {isSubmitting ? "RESPONDING..." : "RESPOND"}
                </button>

                {isSubmitSuccessful && (
                  <div className={`text-right ${resultColor}`}>{result}</div>
                )}
                <RadioGroup
                  aria-label="status"
                  name="status"
                  value={selectedStatus}
                  onChange={(event) => updateStatus(event.target.value)}
                >
                  <FormControlLabel value="new" control={<Radio />} label="New" />
                  <FormControlLabel value="progress" control={<Radio />} label="In Progress" />
                  <FormControlLabel value="resolved" control={<Radio />} label="Resolved" />
                </RadioGroup>
                </div>
            </div>
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
};

const TicketNewComponent: React.FC = () => {
  const [ticketData, setTicketData] = useState<Ticket[]>([]);
  const [result, setResult] = useState<string>();
  const [resultColor, setResultColor] = useState<string>();

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const response = await axios.post('/api/admin', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setTicketData(response.data.data);
        }
      } catch (err: any) {
        setResult(err.response?.data.message + ': ' + err.response?.statusText);
        setResultColor('text-red-500');
      }
    };

    retrieveData();
  }, []);

  return (
    <>
      {ticketData.map((ticket, index) => (
        <TicketNew key={index} ticket={ticket} />
      ))}
    </>
  );
};

export default TicketNewComponent;
