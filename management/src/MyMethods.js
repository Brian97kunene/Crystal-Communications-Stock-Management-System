class MyClass {


    static  formatDate(date) {
        let a = date.split("T")
        let aa = a[1].split(".")


        const formated = a[0] +" at: "+ aa[0];

       // console.log(formated);
        const d = new Date(date);
        const newdate = d.toLocaleString();

        return newdate
    }



    static async getLiveProducts() {



        try {
            
            var response = await fetch("http://localhost:5555/api/syntech-feed");

            const data = await response.json();
            console.log(data);
            return data.products ;
        }
        catch(err)
        { console.log(err); }


    }
    static async getAllDbProducts() {



        try {
            
            var response = await fetch("http://localhost:5552/allproducts/");

            const data = await response.json();
            console.log(data);
            return data.data ;
        }
        catch(err)
        { console.log(err); }


    }
    static async getProduct() {



        try {
            
            var response = await fetch("http://localhost:5552/product/");

            const data = await response.json();
            console.log(data);
            return data.data ;
        }
        catch(err)
        { console.log(err); }


    }
    static async getProducts() {
        const port = 5552;         

        const response = await fetch(`http://localhost:${port}/getproductcount`)


        var data = response.json();

        return data;

    }

    static async deleteProducts(products, supp_code) {
        const port = 5552;
        

        try {
            let prods = [];
            products.forEach((i) => {
                prods.push(i);
      
               // console.log("these are ", i);
              //  console.log("sup ", supp_code);
            }
            
            );
        console.log(prods);
                const response =  await fetch(`http://localhost:${port}/api/syntech/bulk-delete`, {
                    method: "DELETE", // or "PATCH" if partial updates
                    headers: {
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        rows: prods,
                        supplier: supp_code
                    }),
                });

                //var prod = JSON.stringify( x ) ;

                

                return response;

            }
            catch (err) {

               

                return err;

        };



    }

    static async syncProducts(products) {
        const port = 5552;
        

        try {

            console.log(products);
            console.log(typeof products);

            let prods = [];
            
        console.log(prods);
                const response =  await fetch(`http://localhost:${port}/api/sync`, {
                    method: "POST", // or "PATCH" if partial updates
                    headers: {
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                         products
                      
                      
                    }),
                });

                //var prod = JSON.stringify( x ) ;

                

                return response;

            }
            catch (err) {

               

                return err;

        };



    }
    static async syncProduct(products,supp) {
        const port = 5552;
        

        try {

            console.log(products);
            console.log(typeof products);

            let prods = [];
            products.forEach((i) => {
            
                prods.push(i);
      
               // console.log("these are ", i);
              //  console.log("sup ", supp_code);
            }
            
            );
        console.log(prods);
                const response =  await fetch(`http://localhost:${port}/api/sync`, {
                    method: "POST", // or "PATCH" if partial updates
                    headers: {
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        rows: prods,
                        supplier: supp
                      
                    }),
                });

                //var prod = JSON.stringify( x ) ;

                

                return response;

            }
            catch (err) {

               

                return err;

        };



    }


    static async unsyncProducts(products) {
        const port = 5552;
        

        try {
            let prods = [];
            products.forEach((i) => {
                prods.push(i);
      
               // console.log("these are ", i);
              //  console.log("sup ", supp_code);
            }
            
            );
        console.log(prods);
                const response =  await fetch(`http://localhost:${port}/api/unsync`, {
                    method: "POST", // or "PATCH" if partial updates
                    headers: {
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        products
                      
                    }),
                });

                //var prod = JSON.stringify( x ) ;

                

                return response;

            }
            catch (err) {

               

                return err;

        };



    }


    static async insertProducts(products, supp_code) {
        const port = 5552;

        try {
            let prods = [];
            products.forEach(i => {
                prods.push(i);
                console.log("these are ", i);
            }

            );
            const response = await fetch(`http://localhost:${port}/api/syntech/bulk-insert`, {
                method: "POST", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    rows: prods,
                    supplier: supp_code
                }),
            });

            //var prod = JSON.stringify( x ) ;



            return response;

        }
        catch (err) {



            return err;

        };



    }







    static async updateProducts(products, supp_code) {
        const port = 5552;

        try {
            let prods = [];
            products.forEach(i => {
                prods.push(i);
                console.log("these are ", i);
            }

            );
            const response = await fetch(`http://localhost:${port}/api/syntech/bulk-update`, {
                method: "POST", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    rows: prods,
                    supplier: supp_code
                }),
            });

            //var prod = JSON.stringify( x ) ;



            return response;

        }
        catch (err) {



            return err;

        };



    }

    static async getOtherSupplier(sku) {
        const port = 5552;


        console.log("looking for ",sku);

        try {
           

            
            const response = await fetch(`http://localhost:${port}/api/getothersuppliers`);

            //var prod = JSON.stringify( x ) ;


            var data = await response.json();

            console.log(data.data);

            return data.data;


        }
        catch (err) {



            return err;

        };



    }






}

export default  MyClass;