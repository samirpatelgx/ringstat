localtunnel() 
{
  lt -s ringstat --port 5000;
}

while :
do
  localtunnel
done