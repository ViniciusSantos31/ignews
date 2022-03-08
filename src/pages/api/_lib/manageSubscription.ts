import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripes";

export async function saveSubscription(
  subScriptionId: string,
  customerId: string,
  createAction = false
) {
  // Buscar o user no banco do FaundaDB com o customerId
  // Salvar os dados da subscription no FaundaDB

  const userRef = await fauna.query(
    q.Select("ref", q.Get(q.Match(q.Index("user_by_customer_id"), customerId)))
  );

  const subscription = await stripe.subscriptions.retrieve(subScriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscriptionData })
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select("ref", q.Get(q.Match(q.Index("subs_by_id"), subScriptionId))),
        { data: subscriptionData }
      )
    );
  }
}
