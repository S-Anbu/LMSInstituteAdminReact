// ** React Imports
import { useState } from 'react';
// ** MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import MuiCardContent from '@mui/material/CardContent';
// ** Third Party Imports
import SubscriptionHeader from 'features/payment-management/subscriptions/components/SubscriptionHeader';
import SubscriptionCTA from 'features/payment-management/subscriptions/components/SubscriptionCTA';
import SubscriptionPlans from 'features/payment-management/subscriptions/components/SubscriptionPlans';
import SubscriptionTable from 'features/payment-management/subscriptions/components/SubscriptionTable';
import SubscriptionFooter from 'features/payment-management/subscriptions/components/SubscriptionFooter';
import SubscriptionDataTable from 'features/payment-management/subscriptions/components/SubscriptionDataTable';

// ** Styled Components
const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: `${theme.spacing(2, 2)} !important`,
  [theme.breakpoints.down('xl')]: {
    padding: `${theme.spacing(2)} !important`
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(2, 5)} !important`
  }
}));

const data = {
  pricingPlans: [
    {
      imgWidth: 140,
      imgHeight: 140,
      title: 'Basic',
      monthlyPrice: 0,
      currentPlan: true,
      popularPlan: false,
      subtitle: 'A simple start for everyone',
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-CGlChBtj__Xxdz5x1MhpgJTIBMKwvaMqtfk1dlvRYGp2qMTuFX7qEd4577tQp_Bc_4A&usqp=CAU',
      yearlyPlan: {
        perMonth: 0,
        totalAnnual: 0
      },
      planBenefits: [
        '100 responses a month',
        'Unlimited forms and surveys',
        'Unlimited fields',
        'Basic form creation tools',
        'Up to 2 subdomains'
      ]
    },
    {
      imgWidth: 140,
      imgHeight: 140,
      monthlyPrice: 49,
      title: 'Standard',
      popularPlan: true,
      currentPlan: false,
      subtitle: 'For small to medium businesses',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLJmhE49u6xWntXFpVGbT-dX6gO54l1JCvyA&usqp=CAU',
      yearlyPlan: {
        perMonth: 40,
        totalAnnual: 480
      },
      planBenefits: [
        'Unlimited responses',
        'Unlimited forms and surveys',
        'Instagram profile page',
        'Google Docs integration',
        'Custom “Thank you” page'
      ]
    },
    {
      imgWidth: 140,
      imgHeight: 140,
      monthlyPrice: 99,
      popularPlan: false,
      currentPlan: false,
      title: 'Enterprise',
      subtitle: 'Solution for big organizations',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH_8LezXBeE0Vfp1p51nEPwPtzHuhul8meqw&usqp=CAU',
      yearlyPlan: {
        perMonth: 80,
        totalAnnual: 960
      },
      planBenefits: ['PayPal payments', 'Logic Jumps', 'File upload with 5GB storage', 'Custom domain support', 'Stripe integration']
    }
  ],

  pricingTable: {
    header: [
      {
        title: 'Features',
        subtitle: 'Native Front Features'
      },
      {
        title: 'Starter',
        subtitle: 'Free'
      },
      {
        isPro: true,
        title: 'Pro',
        subtitle: '$7.5/month'
      },
      {
        title: 'Enterprise',
        subtitle: '$16/month'
      }
    ],
    rows: [
      {
        pro: true,
        starter: true,
        enterprise: true,
        feature: '14-days free trial'
      },
      {
        pro: false,
        starter: false,
        enterprise: true,
        feature: 'No user limit'
      },
      {
        pro: true,
        starter: false,
        enterprise: true,
        feature: 'Product Support'
      },
      {
        starter: false,
        enterprise: true,
        pro: 'Add-On Available',
        feature: 'Email Support'
      },
      {
        pro: true,
        starter: false,
        enterprise: true,
        feature: 'Integrations'
      },
      {
        starter: false,
        enterprise: true,
        pro: 'Add-On Available',
        feature: 'Removal of Front branding'
      },
      {
        pro: false,
        starter: false,
        enterprise: true,
        feature: 'Active maintenance & support'
      },
      {
        pro: false,
        starter: false,
        enterprise: true,
        feature: 'Data storage for 365 days'
      }
    ]
  }
};

const yourFaqData = {
  faq: [
    {
      id: 'responses-limit',
      question: 'What counts towards the 100 responses limit?',
      answer:
        'We count all responses submitted through all your forms in a month. If you already received 100 responses this month, you won’t be able to receive any more of them until next month when the counter resets.'
    },
    {
      id: 'process-payments',
      question: 'How do you process payments?',
      answer:
        'We accept Visa®, MasterCard®, American Express®, and PayPal®. So you can be confident that your credit card information will be kept safe and secure.'
    },
    {
      id: 'payment-methods',
      question: 'What payment methods do you accept?',
      answer: '2Checkout accepts all types of credit and debit cards.'
    },
    {
      id: 'money-back-guarantee',
      question: 'Do you have a money-back guarantee?',
      answer: 'Yes. You may request a refund within 30 days of your purchase without any additional explanations.'
    },
    {
      id: 'more-questions',
      question: 'I have more questions. Where can I get help?',
      answer: 'Please contact us if you have any other questions or concerns. We’re here to help!'
    }
  ]
};

const Subscription = () => {
  // ** States
  const [plan, setPlan] = useState('annually');
  const handleChange = (e) => {
    if (e.target.checked) {
      setPlan('annually');
    } else {
      setPlan('monthly');
    }
  };

  return (
    <Card>
      <CardContent>
        <SubscriptionHeader plan={plan} handleChange={handleChange} />

        <SubscriptionDataTable />

        <SubscriptionPlans plan={plan} data={data.pricingPlans} />
      </CardContent>
      <SubscriptionCTA />
      <CardContent>
        <SubscriptionTable data={data.pricingTable} />
      </CardContent>
      <CardContent sx={{ backgroundColor: 'action.hover' }}>
        <SubscriptionFooter data={yourFaqData} />
      </CardContent>
    </Card>
  );
};

export default Subscription;
