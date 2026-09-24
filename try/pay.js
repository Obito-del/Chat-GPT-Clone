
// the code below turns the first letter of a word capitalized 
    // const word = "nati tefera";
    // const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    // console.log(capitalized); 
// num 2 class work
    const str = "nati nati";
    const capitalized = str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    console.log(capitalized); 

// the code below will count only vowels from a word 
    // function countVowels(str) {
    //   const matches = str.match(/[aeiou]);
    //   return matches ? matches.length : 0;
    // }   
    // console.log(countVowels)

        function countVowels(word) {
        const vowels = "aeiouAEIOU";
         let count = 0;
    
        for (let char of word) {
            if (vowels.includes(char)) {
                count++;
            }
        }
    
    return count;
}


console.log(countVowels("Abenezer")); 

// the code below will find the second largest number in an arry

