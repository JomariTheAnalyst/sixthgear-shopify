import { shopifyGraphql } from "../client";

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Mutation Strings Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_RESET_BY_URL_MUTATION = `
  mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
    customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      customer {
        id
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACTIVATE_BY_URL_MUTATION = `
  mutation customerActivateByUrl($activationUrl: URL!, $password: String!) {
    customerActivateByUrl(activationUrl: $activationUrl, password: $password) {
      customer {
        id
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate(
    $customerAccessToken: String!
    $address: MailingAddressInput!
  ) {
    customerAddressCreate(
      customerAccessToken: $customerAccessToken
      address: $address
    ) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        provinceCode
        country
        countryCodeV2
        zip
        phone
        name
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation customerAddressUpdate(
    $customerAccessToken: String!
    $id: ID!
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      customerAccessToken: $customerAccessToken
      id: $id
      address: $address
    ) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        provinceCode
        country
        countryCodeV2
        zip
        phone
        name
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete(
    $customerAccessToken: String!
    $id: ID!
  ) {
    customerAddressDelete(
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION = `
  mutation customerDefaultAddressUpdate(
    $customerAccessToken: String!
    $addressId: ID!
  ) {
    customerDefaultAddressUpdate(
      customerAccessToken: $customerAccessToken
      addressId: $addressId
    ) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Mutation Callers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export async function customerCreate(input: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_CREATE_MUTATION,
    { input },
    true
  );

  if (errors?.length) {
  }

  return data?.customerCreate ?? null;
}

export async function customerAccessTokenCreate(input: {
  email: string;
  password: string;
}) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    { input },
    true
  );

  if (errors?.length) {
  }

  return data?.customerAccessTokenCreate ?? null;
}

export async function customerAccessTokenDelete(
  customerAccessToken: string
) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
    { customerAccessToken },
    true
  );

  if (errors?.length) {
  }

  return data?.customerAccessTokenDelete ?? null;
}

export async function customerRecover(email: string) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_RECOVER_MUTATION,
    { email },
    true
  );

  if (errors?.length) {
  }

  return data?.customerRecover ?? null;
}

export async function customerResetByUrl(
  resetUrl: string,
  password: string
) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_RESET_BY_URL_MUTATION,
    { resetUrl, password },
    true
  );

  if (errors?.length) {
  }

  return data?.customerResetByUrl ?? null;
}

export async function customerActivateByUrl(
  activationUrl: string,
  password: string
) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_ACTIVATE_BY_URL_MUTATION,
    { activationUrl, password },
    true
  );

  if (errors?.length) {
  }

  return data?.customerActivateByUrl ?? null;
}

export async function customerUpdate(
  customerAccessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
  }
) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_UPDATE_MUTATION,
    { customerAccessToken, customer },
    true
  );

  if (errors?.length) {
  }

  return data?.customerUpdate ?? null;
}

export async function customerAddressCreate(input: {
  customerAccessToken: string;
  address: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
}) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_ADDRESS_CREATE_MUTATION,
    input,
    true
  );

  if (errors?.length) {
  }

  return data?.customerAddressCreate ?? null;
}

export async function customerAddressUpdate(input: {
  customerAccessToken: string;
  id: string;
  address: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
}) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_ADDRESS_UPDATE_MUTATION,
    input,
    true
  );

  if (errors?.length) {
  }

  return data?.customerAddressUpdate ?? null;
}

export async function customerAddressDelete(input: {
  customerAccessToken: string;
  id: string;
}) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_ADDRESS_DELETE_MUTATION,
    input,
    true
  );

  if (errors?.length) {
  }

  return data?.customerAddressDelete ?? null;
}

export async function customerDefaultAddressUpdate(input: {
  customerAccessToken: string;
  addressId: string;
}) {
  const { data, errors } = await shopifyGraphql<any>(
    CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION,
    input,
    true
  );

  if (errors?.length) {
  }

  return data?.customerDefaultAddressUpdate ?? null;
}
